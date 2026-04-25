from fastapi import APIRouter
import random

router = APIRouter(prefix="/api/drone", tags=["drone"])

@router.get("/tracks")
async def get_tracks():
    return [
        {
            "id": f"D-{random.randint(100, 999)}",
            "type": "DARK",
            "threat_level": "CRITICAL",
            "position": {"x": random.uniform(-1, 1), "y": random.uniform(-1, 1)},
            "speed": random.uniform(20, 100),
            "altitude": random.uniform(50, 300),
            "bearing": random.uniform(0, 360),
            "rf_detected": False,
            "acoustic_confidence": 0.92
        },
        {
            "id": f"U-{random.randint(100, 999)}",
            "type": "UNIDENTIFIED",
            "threat_level": "HIGH",
            "position": {"x": random.uniform(-1, 1), "y": random.uniform(-1, 1)},
            "speed": random.uniform(10, 60),
            "altitude": random.uniform(20, 150),
            "bearing": random.uniform(0, 360),
            "rf_detected": True,
            "acoustic_confidence": 0.45
        }
    ]
