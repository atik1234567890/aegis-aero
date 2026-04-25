from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.incident import Incident, IncidentDB, IncidentCreate, IncidentStatusUpdate, IncidentNote
from database import get_db
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

@router.get("", response_model=List[Incident])
async def get_incidents(
    severity: Optional[str] = None,
    module: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    query = select(IncidentDB)
    if severity and severity != "ALL":
        query = query.where(IncidentDB.severity == severity)
    if module and module != "ALL MODULES":
        query = query.where(IncidentDB.module == module)
    if status:
        query = query.where(IncidentDB.status == status)
    
    query = query.order_by(IncidentDB.timestamp.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=Incident)
async def create_incident(incident: IncidentCreate, db: AsyncSession = Depends(get_db)):
    db_incident = IncidentDB(**incident.dict())
    db.add(db_incident)
    await db.commit()
    await db.refresh(db_incident)
    return db_incident

@router.post("/{id}/resolve")
async def resolve_incident(id: str, db: AsyncSession = Depends(get_db)):
    query = update(IncidentDB).where(IncidentDB.id == id).values(status="RESOLVED")
    await db.execute(query)
    await db.commit()
    return {"message": f"Incident {id} marked as resolved"}

@router.put("/{id}/status")
async def update_status(id: str, update_data: IncidentStatusUpdate, db: AsyncSession = Depends(get_db)):
    query = update(IncidentDB).where(IncidentDB.id == id).values(status=update_data.status)
    await db.execute(query)
    await db.commit()
    return {"message": f"Incident {id} status updated to {update_data.status}"}

@router.post("/{id}/note")
async def add_note(id: str, note: IncidentNote, db: AsyncSession = Depends(get_db)):
    # For now, just a mock note success, we could add a Notes table later
    return {"message": f"Note added to incident {id}: {note.note}"}
