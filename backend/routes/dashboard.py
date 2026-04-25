from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import random
import time
from services.threat_engine import calculate_threat_score
from services.nexus_ai import generate_analysis
from services.state_manager import state_manager
from database import get_db
from models.incident import IncidentDB

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/status")
async def get_status(db: AsyncSession = Depends(get_db)):
    state_manager.update_state()
    cyber_state = state_manager.get_cyber_status()
    drone_tracks = state_manager.get_drone_tracks()
    
    # Derive module status from state
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
    
    # Fetch real recent alerts from DB
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

    status_data = {
        "threat_score": score,
        "threat_level": level,
        "active_modules": modules,
        "recent_alerts": recent_alerts,
        "timestamp": time.time()
    }
    
    status_data["nexus_analysis"] = generate_analysis(status_data)
    
    return status_data
