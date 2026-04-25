from dotenv import load_dotenv
load_dotenv()

import os
import json
import asyncio
import random
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from loguru import logger
import sys

from contextlib import asynccontextmanager

from routes import dashboard, xray, drone, cyber, incidents, auth, flights
from services.threat_engine import calculate_threat_score
from services.nexus_ai import generate_analysis
from services.flight_service import FlightService
from services.state_manager import state_manager
from models.xray_model import XRayThreatDetector
from database import init_db, SessionLocal
from models.incident import IncidentDB
from sqlalchemy import select

# Configure Logging
logger.remove()
logger.add(sys.stderr, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>", level="INFO")
logger.add("logs/aegis_aero.log", rotation="10 MB", retention="10 days", level="INFO")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await init_db()
    app.state.xray_model = XRayThreatDetector()
    app.state.flight_service = FlightService()
    logger.success("AEGIS-AERO: System Boot Sequence Complete")
    logger.info("Database initialized and ThreatVision model loaded")
    yield
    # Shutdown logic (if any)

app = FastAPI(title="AEGIS-AERO Intelligence Platform", lifespan=lifespan)

# Initialize Services
flight_service = FlightService()

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app", "*.railway.app"]
)

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
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(xray.router)
app.include_router(drone.router)
app.include_router(cyber.router)
app.include_router(incidents.router)
app.include_router(flights.router)

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
            # Update and get global state
            state_manager.update_state()
            cyber_state = state_manager.get_cyber_status()
            drone_tracks = state_manager.get_drone_tracks()
            
            # Derive module status
            modules = {
                "darkhawk": {
                    "status": "ACTIVE", 
                    "integrity": 100 - (len(drone_tracks) * 5), 
                    "alerts": len([d for d in drone_tracks if d['threat_level'] in ['HIGH', 'CRITICAL']])
                },
                "threatvision": {"status": "SCANNING", "integrity": 95, "alerts": 0},
                "cyberguard": {
                    "status": "MONITORING", 
                    "integrity": int(100 - cyber_state['gps_drift']), 
                    "alerts": 1 if cyber_state['spoofing_detected'] else 0
                },
                "perimetermind": {"status": "ACTIVE", "integrity": 90, "alerts": 0}
            }
            
            score, level = calculate_threat_score(modules)
            
            # Fetch live flight data
            live_flights = await flight_service.get_live_flights()
            
            # Fetch recent alerts from DB
            async with SessionLocal() as db:
                result = await db.execute(select(IncidentDB).order_by(IncidentDB.timestamp.desc()).limit(5))
                db_incidents = result.scalars().all()
                recent_alerts = []
                for inc in db_incidents:
                    recent_alerts.append({
                        "id": str(inc.id),
                        "title": inc.title,
                        "timestamp": inc.timestamp.strftime("%H:%M:%S"),
                        "severity": inc.severity,
                        "icon": "shield" if inc.module == "PerimeterMind" else "drone" if inc.module == "DarkHawk" else "cyber" if inc.module == "CyberGuard" else "xray"
                    })

            status_update = {
                "threat_score": score,
                "threat_level": level,
                "active_modules": modules,
                "live_flights": live_flights,
                "alerts": recent_alerts,
                "timestamp": time.time()
            }
            
            # Generate AI analysis
            status_update["nexus_analysis"] = generate_analysis(status_update)
            
            await websocket.send_text(json.dumps(status_update))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
