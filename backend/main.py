import os
import json
import asyncio
import random
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import dashboard, xray, drone, cyber, incidents
from services.threat_engine import calculate_threat_score
from services.nexus_ai import generate_analysis
from models.xray_model import XRayThreatDetector

load_dotenv()

app = FastAPI(title="AEGIS-AERO Intelligence Platform")

# Initialize models
app.state.xray_model = XRayThreatDetector()
print("ThreatVision model loaded")

# CORS Setup
origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://aegis-aero.vercel.app",
]

# Allow any vercel preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + [f"https://{org}.vercel.app" for org in ["*"]],
    allow_origin_regex="https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router)
app.include_router(xray.router)
app.include_router(drone.router)
app.include_router(cyber.router)
app.include_router(incidents.router)

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Generate live status update
            modules = {
                "darkhawk": {"status": "ACTIVE", "integrity": random.randint(85, 98), "alerts": random.randint(0, 3)},
                "threatvision": {"status": "SCANNING", "integrity": random.randint(70, 95), "alerts": random.randint(0, 2)},
                "cyberguard": {"status": "MONITORING", "integrity": random.randint(90, 100), "alerts": random.randint(0, 5)},
                "perimetermind": {"status": "ACTIVE", "integrity": random.randint(80, 90), "alerts": random.randint(0, 1)}
            }
            score, level = calculate_threat_score(modules)
            
            status_update = {
                "threat_score": score,
                "threat_level": level,
                "active_modules": modules,
                "timestamp": time.time(),
                "nexus_analysis": generate_analysis()
            }
            
            await websocket.send_text(json.dumps(status_update))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
