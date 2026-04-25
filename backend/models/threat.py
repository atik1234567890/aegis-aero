from pydantic import BaseModel
from typing import List, Optional

class BBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Detection(BaseModel):
    label: str
    confidence: float
    bbox: BBox

class ThreatStatus(BaseModel):
    status: str
    integrity: int
    alerts: int

class ModuleStatus(BaseModel):
    darkhawk: ThreatStatus
    threatvision: ThreatStatus
    cyberguard: ThreatStatus
    perimetermind: ThreatStatus

class Alert(BaseModel):
    id: str
    title: str
    timestamp: str
    severity: str
    icon: str
