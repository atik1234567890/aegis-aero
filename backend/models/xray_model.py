import random
import time
import io
import os
import json
from PIL import Image
import numpy as np
from loguru import logger
import google.generativeai as genai

class XRayThreatDetector:
    def __init__(self):
        self.model = None
        self.model_loaded = False
        self.use_gpu = os.getenv("USE_GPU", "false").lower() == "true"
        self.production_mode = os.getenv("ENVIRONMENT") == "production"
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        self.classes = {
            "knife": "BLADE WEAPON",
            "scissors": "SHARP OBJECT",
            "gun": "FIREARM",
            "cell phone": "ELECTRONIC DEVICE",
            "laptop": "ELECTRONIC DEVICE",
            "bottle": "LIQUID CONTAINER"
        }
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.vision_model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("ThreatVision: Gemini Vision Engine Active")
            except Exception as e:
                self.vision_model = None
                logger.error(f"ThreatVision: Gemini Init Error - {e}")
        else:
            self.vision_model = None

        self.load_model()

    def load_model(self):
        """Attempts to load local YOLO model."""
        try:
            from ultralytics import YOLO
            import torch
            model_path = os.getenv("YOLO_MODEL_PATH", "yolov8n.pt")
            device = "cuda" if self.use_gpu and torch.cuda.is_available() else "cpu"
            self.model = YOLO(model_path)
            self.model.to(device)
            self.model_loaded = True
            logger.success("ThreatVision: Local ML Engine Active")
        except:
            self.model_loaded = False

    async def detect_threats(self, image_bytes):
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        
        # 1. Try Local YOLO Model if loaded
        if self.model:
            return self._run_local_inference(img)
            
        # 2. Try Gemini Vision for REAL AI Analysis (No Hardware needed)
        if self.vision_model:
            return await self._run_gemini_vision(img)
            
        # 3. Fallback to Simulation if no AI/Model
        logger.warning("ThreatVision: Falling back to simulation")
        return self._simulate_detections(width, height)

    async def _run_gemini_vision(self, img):
        """Uses Gemini Vision to detect threats in the image."""
        try:
            prompt = """
            Analyze this baggage X-ray/photo. Identify any security threats like guns, knives, or suspicious electronics.
            Return ONLY a JSON array of objects with this format:
            [{"label": "FIREARM", "confidence": 0.98, "bbox": {"x": 100, "y": 200, "width": 50, "height": 50}, "threat_level": "CRITICAL"}]
            Coordinates should be in pixels. If no threats, return [].
            """
            response = self.vision_model.generate_content([prompt, img])
            
            # Clean response text for JSON parsing
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
                
            detections = json.loads(text)
            logger.success(f"ThreatVision: Gemini detected {len(detections)} items")
            return detections
        except Exception as e:
            logger.error(f"ThreatVision: Gemini Vision Error - {e}")
            return []

    def _run_local_inference(self, img):
        # ... existing YOLO logic ...
        results = self.model(img)[0]
        detections = []
        for box in results.boxes:
            class_id = int(box.cls[0])
            conf = float(box.conf[0])
            coco_label = results.names[class_id]
            
            if coco_label in self.classes:
                threat_label = self.classes[coco_label]
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                detections.append({
                    "label": threat_label,
                    "confidence": conf,
                    "bbox": {
                        "x": int(x1), 
                        "y": int(y1), 
                        "width": int(x2 - x1), 
                        "height": int(y2 - y1)
                    },
                    "threat_level": self._get_severity(threat_label)
                })
        return detections

    def _get_severity(self, threat_label):
        if threat_label in ["FIREARM", "BLADE WEAPON"]:
            return "CRITICAL"
        elif threat_label in ["SHARP OBJECT"]:
            return "HIGH"
        elif threat_label in ["ELECTRONIC DEVICE"]:
            return "MEDIUM"
        return "LOW"

    def _simulate_detections(self, width, height):
        detections = []
        if random.random() > 0.3:
            num_threats = random.randint(1, 2)
            potential_threats = list(self.classes.items())
            
            for _ in range(num_threats):
                coco_class, threat_label = random.choice(potential_threats)
                x = random.randint(int(width * 0.1), int(width * 0.6))
                y = random.randint(int(height * 0.1), int(height * 0.6))
                w = random.randint(50, 150)
                h = random.randint(50, 150)
                conf = random.uniform(0.85, 0.99)
                
                detections.append({
                    "label": threat_label,
                    "confidence": conf,
                    "bbox": {"x": x, "y": y, "width": w, "height": h},
                    "threat_level": self._get_severity(threat_label)
                })
        return detections

    def calculate_risk(self, detections):
        if not detections:
            return "CLEAR"
        
        severities = [d["threat_level"] for d in detections]
        
        if "CRITICAL" in severities:
            return "CRITICAL"
        
        high_count = severities.count("HIGH")
        if high_count >= 2:
            return "HIGH"
        if high_count >= 1:
            return "SUSPICIOUS"
            
        return "CLEAR"
