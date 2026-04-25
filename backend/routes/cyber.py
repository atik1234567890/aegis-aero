from fastapi import APIRouter
from services.state_manager import state_manager

router = APIRouter(prefix="/api/cyber", tags=["cyber"])

@router.get("/status")
async def get_status():
    state_manager.update_state()
    state = state_manager.get_cyber_status()
    
    return {
        **state,
        "threat_distribution": {
            "gps_spoofing": 35,
            "arp_poisoning": 20,
            "dos_attempt": 15,
            "port_scan": 18,
            "normal": 12
        }
    }
