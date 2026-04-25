from fastapi import APIRouter
import random
import time
from services.threat_engine import calculate_threat_score
from services.nexus_ai import generate_analysis

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/status")
async def get_status():
    modules = {
        "darkhawk": {"status": "ACTIVE", "integrity": random.randint(85, 98), "alerts": random.randint(0, 3)},
        "threatvision": {"status": "SCANNING", "integrity": random.randint(70, 95), "alerts": random.randint(0, 2)},
        "cyberguard": {"status": "MONITORING", "integrity": random.randint(90, 100), "alerts": random.randint(0, 5)},
        "perimetermind": {"status": "ACTIVE", "integrity": random.randint(80, 90), "alerts": random.randint(0, 1)}
    }
    
    score, level = calculate_threat_score(modules)
    
    return {
        "threat_score": score,
        "threat_level": level,
        "active_modules": modules,
        "recent_alerts": [
            {
                "id": str(random.randint(1000, 9999)),
                "title": "Unidentified Drone Detected",
                "timestamp": time.strftime("%H:%M:%S"),
                "severity": "CRITICAL",
                "icon": "drone"
            }
        ],
        "nexus_analysis": generate_analysis()
    }
