from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as transforms
import io
from torchvision import models
import torch.nn as nn
from huggingface_hub import hf_hub_download
import os
from huggingface_hub import login
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Login to Hugging Face Hub
access_token = os.getenv("HF_TOKEN")
if access_token:
    login(token=access_token)
else:
    print("No Hugging Face token found. Please set the HF_TOKEN environment variable.")


try:
    # Download the model from Hugging Face Hub
    model_path = hf_hub_download(
        repo_id="retinovisionai/retino-vision-v1", 
        filename="efficientnetb4_dr_complete.pth"
    )
    print(f"Model path: {model_path}")

    model = models.efficientnet_b4()
    
    in_features = model.classifier[1].in_features
    
    if not isinstance(in_features, int):
        in_features = 1792  
    
    model.classifier[1] = nn.Linear(in_features, 5)
    
    state_dict = torch.load(model_path, map_location="cpu",weights_only=False)

    if isinstance(state_dict, dict) and 'state_dict' in state_dict:
        model.load_state_dict(state_dict['state_dict'], strict=False)
    elif isinstance(state_dict, dict):
        model.load_state_dict(state_dict, strict=False)
except Exception as e:
    print(f"Error loading model: {e}")
    model = models.efficientnet_b4()
    in_features = model.classifier[1].in_features
    if not isinstance(in_features, int):
        in_features = 1792
    model.classifier[1] = nn.Linear(in_features, 5)

#additional configs if needed in future    
try:
    pass
except Exception as e:
    print(f"Error configuring model: {e}")
    model = models.efficientnet_b4()
    in_features = model.classifier[1].in_features
    if isinstance(in_features, (int, torch.Tensor)):
        in_features = int(in_features)
    else:
        in_features = 1792
    model.classifier[1] = nn.Linear(in_features, 5)

model.eval()

# Image transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    # Apply transform to convert to tensor and normalize
    input_tensor = transform(image)
    # Ensure the result is a tensor before using unsqueeze
    if not isinstance(input_tensor, torch.Tensor):
        input_tensor = transforms.ToTensor()(input_tensor)
    input_tensor = input_tensor.unsqueeze(0)
    
    with torch.no_grad():
        output = model(input_tensor)
        pred = torch.argmax(output, dim=1).item()
        confidence = torch.softmax(output, dim=1).squeeze().tolist()

    return JSONResponse(content={
        "prediction": pred,
        "confidence": confidence
    })
