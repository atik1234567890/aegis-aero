from fastapi import APIRouter
from services.state_manager import state_manager

router = APIRouter(prefix="/api/drone", tags=["drone"])

@router.get("/tracks")
async def get_tracks():
    state_manager.update_state()
    return state_manager.get_drone_tracks()
