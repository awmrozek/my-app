from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"  # change if your model is named differently

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    payload = {
        "model": MODEL_NAME,
        "prompt": req.message,
        "stream": False  # If you want streaming, we can implement it too
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        return ChatResponse(reply=data["response"].strip())
    except Exception as e:
        return ChatResponse(reply=f"[Error]: {str(e)}")
