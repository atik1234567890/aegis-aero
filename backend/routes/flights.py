from fastapi import APIRouter, Request, Query
from typing import Optional

router = APIRouter(prefix="/api/flights", tags=["flights"])

@router.get("/search")
async def search_flights(request: Request, country: Optional[str] = Query(None)):
    flight_service = request.app.state.flight_service
    flights = await flight_service.get_live_flights(country=country)
    return {
        "country": country,
        "count": len(flights),
        "flights": flights
    }
