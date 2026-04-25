from fastapi import APIRouter
import random
import time

router = APIRouter(prefix="/api/cyber", tags=["cyber"])

@router.get("/status")
async def get_status():
    return {
        "gps_drift": random.uniform(2, 60),
        "gdi_score": random.uniform(1, 10),
        "spoofing_detected": random.random() > 0.7,
        "network_events": [
            {
                "id": str(i),
                "timestamp": time.strftime("%H:%M:%S"),
                "ip": f"192.168.1.{random.randint(1, 255)}",
                "type": random.choice(["ARP_POISON", "PORT_SCAN", "DOS_ATTEMPT", "NORMAL_TRAFFIC"]),
                "status": random.choice(["BLOCKED", "NORMAL", "SUSPICIOUS"])
            } for i in range(20)
        ],
        "threat_distribution": {
            "gps_spoofing": 35,
            "arp_poisoning": 20,
            "dos_attempt": 15,
            "port_scan": 18,
            "normal": 12
        },
        "packets_per_sec": random.randint(1000, 2000),
        "blocked_attacks": random.randint(50, 150)
    }
