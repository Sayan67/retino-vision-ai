import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function analyseImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during image analysis:", error);
    throw error;
  }
}
