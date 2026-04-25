from fastapi import APIRouter, Query
from models.incident import Incident, IncidentNote, IncidentStatusUpdate
from typing import List, Optional
import random
import time

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

# Mock database
mock_incidents = [
    {
        "id": "#AF3E21",
        "timestamp": "2026-04-25 14:22:05",
        "module": "DarkHawk",
        "type": "Unidentified Drone",
        "severity": "CRITICAL",
        "location": "Sector 7 (North)",
        "status": "RESOLVED",
        "description": "Class IV multi-rotor drone detected within restricted perimeter. RF jamming initiated.",
        "detectionMethod": "RF Signature + Acoustic"
    },
    {
        "id": "#BB1290",
        "timestamp": "2026-04-25 14:15:30",
        "module": "CyberGuard",
        "type": "GPS Spoofing",
        "severity": "HIGH",
        "location": "Approach Path Rwy 09",
        "status": "INVESTIGATING",
        "description": "Coordinated GPS drift detected affecting multiple landing aircraft. Signal source estimated NW.",
        "detectionMethod": "Drift Index Analysis"
    }
]

@router.get("", response_model=List[Incident])
async def get_incidents(
    severity: Optional[str] = None,
    module: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20
):
    filtered = mock_incidents
    if severity and severity != "ALL":
        filtered = [i for i in filtered if i["severity"] == severity]
    if module and module != "ALL MODULES":
        filtered = [i for i in filtered if i["module"] == module]
    if status:
        filtered = [i for i in filtered if i["status"] == status]
    
    return filtered[:limit]

@router.post("/{id}/resolve")
async def resolve_incident(id: str):
    return {"message": f"Incident {id} marked as resolved"}

@router.put("/{id}/status")
async def update_status(id: str, update: IncidentStatusUpdate):
    return {"message": f"Incident {id} status updated to {update.status}"}

@router.post("/{id}/note")
async def add_note(id: str, note: IncidentNote):
    return {"message": f"Note added to incident {id}"}
