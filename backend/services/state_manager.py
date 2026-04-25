import random
import time
import os
import psutil
from loguru import logger

class SystemStateManager:
    def __init__(self):
        self.simulation_mode = os.getenv("SIMULATION_MODE", "true").lower() == "true"
        self.cyber_state = {
            "gps_drift": 1.2,
            "gdi_score": 9.8,
            "spoofing_detected": False,
            "network_events": [],
            "packets_per_sec": 0,
            "blocked_attacks": 0
        }
        self.drone_tracks = []
        self._last_net_io = psutil.net_io_counters()
        self._last_update = time.time()
        
        if self.simulation_mode:
            self._init_simulation()
        else:
            logger.info("SystemStateManager: Real-World Mode ACTIVE")

    def _init_simulation(self):
        self.drone_tracks.append({
            "id": "SIM-001",
            "type": "DARK",
            "threat_level": "LOW",
            "position": {"x": 0.5, "y": 0.3},
            "speed": 45.0,
            "altitude": 120.0,
            "bearing": 180.0,
            "rf_detected": False,
            "acoustic_confidence": 0.88
        })
        logger.info("SystemStateManager: Simulation Mode ACTIVE")

    def update_state(self):
        """Updates the state with real machine data where possible."""
        now = time.time()
        dt = now - self._last_update
        if dt < 0.1: return
        self._last_update = now

        # REAL NETWORK MONITORING
        try:
            net_io = psutil.net_io_counters()
            # Calculate packets per second
            pkts_sent = net_io.packets_sent - self._last_net_io.packets_sent
            pkts_recv = net_io.packets_recv - self._last_net_io.packets_recv
            self.cyber_state["packets_per_sec"] = int((pkts_sent + pkts_recv) / dt)
            self._last_net_io = net_io
        except Exception as e:
            logger.error(f"StateManager: Network monitoring error - {e}")

        if not self.simulation_mode:
            # In real mode, we don't add fake drones or spoofing
            # GPS drift is kept at baseline (real GPS requires hardware)
            self.cyber_state["gps_drift"] = 0.5
            self.cyber_state["spoofing_detected"] = False
            return

        # --- SIMULATION LOGIC (Only if enabled) ---
        self.cyber_state["gps_drift"] = max(0.5, min(100.0, self.cyber_state["gps_drift"] + random.uniform(-0.1, 0.15)))
        self.cyber_state["gdi_score"] = max(0.0, min(10.0, self.cyber_state["gdi_score"] + random.uniform(-0.05, 0.05)))
        
        if random.random() > 0.95:
            self.cyber_state["spoofing_detected"] = not self.cyber_state["spoofing_detected"]

        # Simulate network events
        if random.random() > 0.7:
            event_type = random.choice(["ARP_POISON", "PORT_SCAN", "DOS_ATTEMPT", "NORMAL_TRAFFIC"])
            self.cyber_state["network_events"].insert(0, {
                "id": str(int(now)),
                "timestamp": time.strftime("%H:%M:%S"),
                "ip": f"192.168.1.{random.randint(1, 255)}",
                "type": event_type,
                "status": "BLOCKED" if event_type != "NORMAL_TRAFFIC" else "NORMAL"
            })
            self.cyber_state["network_events"] = self.cyber_state["network_events"][:20]

        # Update Drone Tracks
        for track in self.drone_tracks:
            # Move drones slightly
            rad = track["bearing"] * (3.14159 / 180.0)
            dist = (track["speed"] * dt) / 1000.0 # simplified
            track["position"]["x"] += dist * 0.1 # scale for display
            track["position"]["y"] += dist * 0.1
            
            # Wrap around
            if abs(track["position"]["x"]) > 1.0: track["position"]["x"] *= -0.9
            if abs(track["position"]["y"]) > 1.0: track["position"]["y"] *= -0.9
            
            track["altitude"] = max(10, min(500, track["altitude"] + random.uniform(-2, 2)))
            
        # Occasionally add/remove drones
        if len(self.drone_tracks) < 5 and random.random() > 0.98:
            self.drone_tracks.append({
                "id": f"U-{random.randint(100, 999)}",
                "type": random.choice(["DARK", "UNIDENTIFIED"]),
                "threat_level": random.choice(["MEDIUM", "HIGH", "CRITICAL"]),
                "position": {"x": random.uniform(-1, 1), "y": random.uniform(-1, 1)},
                "speed": random.uniform(20, 80),
                "altitude": random.uniform(50, 200),
                "bearing": random.uniform(0, 360),
                "rf_detected": random.random() > 0.5,
                "acoustic_confidence": random.uniform(0.4, 0.9)
            })
        
        if len(self.drone_tracks) > 1 and random.random() > 0.99:
            self.drone_tracks.pop(random.randint(0, len(self.drone_tracks)-1))

    def get_cyber_status(self):
        return self.cyber_state

    def get_drone_tracks(self):
        return self.drone_tracks

state_manager = SystemStateManager()
