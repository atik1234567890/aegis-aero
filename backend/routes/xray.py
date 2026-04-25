from fastapi import APIRouter, UploadFile, File, Request
import uuid
import time
from models.xray_model import XRayThreatDetector

router = APIRouter(prefix="/api/xray", tags=["xray"])

@router.post("/scan")
async def scan_image(request: Request, file: UploadFile = File(...)):
    # Access the model from app state
    detector: XRayThreatDetector = request.app.state.xray_model
    
    # Read image bytes
    image_bytes = await file.read()
    
    # Run detection
    detections = await detector.detect_threats(image_bytes)
    risk_level = detector.calculate_risk(detections)
    
    scan_id = uuid.uuid4().hex[:8].upper()
    
    # Generate NEXUS assessment
    nexus_assessment = "Baggage scan complete. No prohibited items detected. Passenger may proceed."
    
    if risk_level == "CRITICAL":
        critical_items = [d["label"] for d in detections if d["threat_level"] == "CRITICAL"]
        conf = int(detections[0]["confidence"] * 100) if detections else 0
        nexus_assessment = f"{' or '.join(critical_items)} detected with {conf}% confidence. Immediate intervention required. Do NOT allow passenger to proceed."
    elif risk_level in ["HIGH", "SUSPICIOUS"]:
        nexus_assessment = "Suspicious object detected. Manual inspection required before clearance."
    
    return {
        "scan_id": scan_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "detections": detections,
        "risk_level": risk_level,
        "nexus_assessment": nexus_assessment
    }
