# AEGIS-AERO 🛡️ 
Airport Security Intelligence Platform 

## Overview 
Advanced AI-powered security operations center for real-time airport threat detection. 

## Modules 
- 🦅 **DarkHawk**: Drone Detection using acoustic pattern analysis for RF-silent drones.
- 🔬 **ThreatVision**: X-Ray AI Scanner using YOLOv8 for automated threat classification.
- 📡 **CyberGuard**: Network IDS + GPS Spoofing Monitor for protecting critical airspace telemetry.
- 🌍 **PerimeterMind**: Underground Seismic Detection for perimeter integrity.
- 🤖 **NEXUS AI**: Unified Explainable Threat Intelligence and Decision Support.

## Tech Stack 
- **Frontend**: React + Tailwind CSS v4 + Vite
- **Backend**: FastAPI + Python 3.11
- **ML**: YOLOv8 (Simulation Mode) + PyTorch
- **Real-time**: WebSockets
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## Local Setup 

### Backend 
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend 
```bash
cd frontend
npm install
npm run dev
```

## Architecture 
AEGIS-AERO integrates five distinct security modules into a unified SOC dashboard. The backend processes high-fidelity telemetry from simulated sensors and ML models, broadcasting real-time updates via WebSockets to the React frontend. The NEXUS AI engine correlates data across modules to provide explainable threat assessments and unified scoring.
