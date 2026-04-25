from pydantic import BaseModel
from typing import Optional
from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from database import Base

# SQLAlchemy Model
class IncidentDB(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    module = Column(String)
    type = Column(String)
    severity = Column(String)
    location = Column(String)
    status = Column(String, default="OPEN")
    description = Column(Text)
    detectionMethod = Column(String)

# Pydantic Schemas
class Incident(BaseModel):
    id: str
    timestamp: datetime
    module: str
    type: str
    severity: str
    location: str
    status: str
    description: str
    detectionMethod: str

    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    id: str
    module: str
    type: str
    severity: str
    location: str
    description: str
    detectionMethod: str

class IncidentNote(BaseModel):
    note: str

class IncidentStatusUpdate(BaseModel):
    status: str
