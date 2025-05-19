from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torch
import torchvision.transforms as transforms
import io
from torchvision import models
import torch.nn as nn

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    model = models.efficientnet_b4()
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 5) 
    state_dict = torch.load("efficientnetb4_dr_complete.pth", map_location="cpu")
    
    if isinstance(state_dict, dict) and 'state_dict' in state_dict:
        model.load_state_dict(state_dict['state_dict'], strict=False)
    elif isinstance(state_dict, dict):
        model.load_state_dict(state_dict, strict=False)
    else:
        model = state_dict
except Exception as e:
    print(f"Error loading model: {e}")
    model = models.efficientnet_b4()
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 5)

model.eval()

# Image transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        pred = torch.argmax(output, dim=1).item()
        confidence = torch.softmax(output, dim=1).squeeze().tolist()

    return JSONResponse(content={
        "prediction": pred,
        "confidence": confidence
    })
