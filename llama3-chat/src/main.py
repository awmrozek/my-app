from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

def run_llama3(input_text: str) -> str:
    #return "42"
    try:
        # Replace the command below with how you start llama3.2 from bash
        # For example: llama3 --prompt "{input_text}" --some-flags
        # Adjust as per your actual llama3 CLI usage

            #['bash', '-c', f'fortune "{input_text}"'], 
        process = subprocess.run(
            ['bash', '-c', f'fortune'], 
            capture_output=True, text=True, timeout=30
        )
        if process.returncode != 0:
            raise Exception(process.stderr)
        return process.stdout.strip()
    except Exception as e:
        raise RuntimeError(f"Failed to run llama3.2: {e}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = run_llama3(request.message)
    return ChatResponse(reply=reply)

