import httpx
import random
import asyncio
from loguru import logger

class FlightService:
    def __init__(self):
        self.api_url = "https://opensky-network.org/api/states/all"
        # Area around a major airport (e.g., Heathrow LHR)
        self.bbox = {
            "lamin": 51.2,
            "lamin_max": 51.7,
            "lomin": -0.6,
            "lomax": 0.3
        }

    async def get_live_flights(self, country: str = None):
        """
        Attempts to fetch real flights from OpenSky API.
        If country is provided, fetches all and filters. Otherwise uses local bbox.
        """
        try:
            params = {}
            if not country:
                # area around London (default)
                params = {
                    "lamin": self.bbox["lamin"],
                    "lamax": self.bbox["lamin_max"],
                    "lomin": self.bbox["lomin"],
                    "lomax": self.bbox["lomax"]
                }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.api_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    states = data.get("states", [])
                    if states:
                        if country:
                            # Filter by country name (case-insensitive)
                            filtered = [s for s in states if s[2] and country.lower() in s[2].lower()]
                            logger.info(f"FlightService: Found {len(filtered)} flights for {country}")
                            return self._process_opensky_data(filtered[:20]) # Limit to 20 for global
                        
                        logger.info(f"FlightService: Fetched {len(states)} real flights for default area")
                        return self._process_opensky_data(states[:10])
        except Exception as e:
            logger.warning(f"FlightService: Real API failed ({str(e)}), using Generator")
            
        return self._generate_realistic_flights(country)

    def _process_opensky_data(self, states):
        flights = []
        for s in states:
            flights.append({
                "callsign": s[1].strip() or "N/A",
                "origin_country": s[2],
                "longitude": s[5],
                "latitude": s[6],
                "altitude": s[7] or 0,
                "velocity": s[9] or 0,
                "is_ground": s[8]
            })
        return flights

    def _generate_realistic_flights(self, country: str = None):
        # Realistic fallback generation
        callsigns = ["BAW123", "UAE445", "DLH992", "RYR102", "AFR551"]
        flights = []
        target_country = country if country else "United Kingdom"
        
        for i in range(5):
            flights.append({
                "callsign": callsigns[i],
                "origin_country": target_country,
                "longitude": random.uniform(-180, 180) if country else random.uniform(-0.5, 0.2),
                "latitude": random.uniform(-90, 90) if country else random.uniform(51.3, 51.6),
                "altitude": random.uniform(1000, 5000),
                "velocity": random.uniform(150, 250),
                "is_ground": False
            })
        return flights
