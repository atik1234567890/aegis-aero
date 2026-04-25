from pydantic import BaseModel
from typing import Optional

class Incident(BaseModel):
    id: str
    timestamp: str
    module: str
    type: str
    severity: str
    location: str
    status: str
    description: str
    detectionMethod: str

class IncidentNote(BaseModel):
    note: str

class IncidentStatusUpdate(BaseModel):
    status: str
