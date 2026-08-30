from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
import hashlib
import json
import subprocess
import sys
from typing import List, Dict

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_DIR = os.path.join(BASE_DIR, 'content')
BUILD_SCRIPT = os.path.join(BASE_DIR, 'build.py')
ADMIN_USER = "admin"
ADMIN_PASS = "cyberadmin123" 
LANGUAGES = ["en", "ar"]

app = FastAPI(title="Vectra Tips CMS")
security = HTTPBasic()

# Enable CORS for local network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class FileContent(BaseModel):
    path: str
    content: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Auth ---
def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != ADMIN_USER or credentials.password != ADMIN_PASS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# --- Logic ---
def run_build():
    try:
        result = subprocess.run([sys.executable, BUILD_SCRIPT], capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        return str(e)

# --- Endpoints ---

@app.post("/api/login")
async def login(credentials: HTTPBasicCredentials = Depends(security)):
    return {"message": "Authenticated"}

@app.get("/api/files")
async def list_files(user: str = Depends(get_current_user)):
    file_tree = []
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith('.md'):
                rel_path = os.path.relpath(os.path.join(root, file), CONTENT_DIR)
                file_tree.append(rel_path.replace('\\', '/'))
    return sorted(file_tree)

@app.get("/api/file")
async def get_file(path: str, user: str = Depends(get_current_user)):
    full_path = os.path.join(CONTENT_DIR, path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(full_path, 'r', encoding='utf-8') as f:
        return {"content": f.read()}

@app.post("/api/save")
async def save_file(data: FileContent, user: str = Depends(get_current_user)):
    full_path = os.path.join(CONTENT_DIR, data.path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(data.content)
    
    # Run build automatically
    build_log = run_build()
    
    return {"message": "Saved successfully", "build_log": build_log}

@app.delete("/api/file")
async def delete_file(path: str, user: str = Depends(get_current_user)):
    full_path = os.path.join(CONTENT_DIR, path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    os.remove(full_path)
    # Clean up empty directories
    parent = os.path.dirname(full_path)
    while parent != CONTENT_DIR and not os.listdir(parent):
        os.rmdir(parent)
        parent = os.path.dirname(parent)
        
    run_build()
    return {"message": "File deleted"}

@app.post("/api/rename")
async def rename_file(old_path: str, new_path: str, user: str = Depends(get_current_user)):
    old_full = os.path.join(CONTENT_DIR, old_path)
    new_full = os.path.join(CONTENT_DIR, new_path)
    
    if not os.path.exists(old_full):
        raise HTTPException(status_code=404, detail="Original file not found")
        
    os.makedirs(os.path.dirname(new_full), exist_ok=True)
    os.rename(old_full, new_full)
    
    run_build()
    return {"message": "File moved/renamed"}

@app.delete("/api/directory")
async def delete_directory(path: str, user: str = Depends(get_current_user)):
    import shutil
    full_path = os.path.join(CONTENT_DIR, path)
    if not os.path.exists(full_path) or not os.path.isdir(full_path):
        raise HTTPException(status_code=404, detail="Directory not found")
    
    shutil.rmtree(full_path)
    run_build()
    return {"message": "Directory deleted"}

@app.post("/api/build")
async def trigger_build(user: str = Depends(get_current_user)):
    log = run_build()
    return {"message": "Build completed", "log": log}

from fastapi.responses import RedirectResponse

# Serve the Dashboard UI at /admin
app.mount("/admin", StaticFiles(directory=os.path.join(BASE_DIR, "dashboard"), html=True), name="admin")

# Community Admin at /community-admin
app.mount("/community-admin", StaticFiles(directory=BASE_DIR, html=True), name="community-admin")

# Serve the Public Website at /
app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="public")

@app.get("/login")
async def login_redirect():
    return RedirectResponse(url="/admin")

if __name__ == "__main__":
    import uvicorn
    print(f"--- Vectra Tips Unified Server ---")
    print(f"Server is running 24/7")
    uvicorn.run(app, host="0.0.0.0", port=8000)
