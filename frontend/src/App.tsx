import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import XRayScanner from './pages/XRayScanner';
import DroneMonitor from './pages/DroneMonitor';
import CyberThreats from './pages/CyberThreats';
import IncidentLog from './pages/IncidentLog';

function App() {
  const [threatLevel, setThreatLevel] = useState('MEDIUM');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/live';
    let ws: WebSocket;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setThreatLevel(data.threat_level);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connect, 3000); // Reconnect after 3s
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();
    return () => ws?.close();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-accent-red/30 flex flex-col">
        {!isConnected && (
          <div className="fixed top-16 left-0 w-full bg-accent-amber/90 text-black py-1 text-center text-[10px] font-bold z-40 animate-pulse">
            RUNNING IN SIMULATION MODE - BACKEND OFFLINE
          </div>
        )}
        
        <Navbar threatLevel={threatLevel} isConnected={isConnected} />
        
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/xray" element={<XRayScanner />} />
            <Route path="/drones" element={<DroneMonitor />} />
            <Route path="/cyber" element={<CyberThreats />} />
            <Route path="/logs" element={<IncidentLog />} />
          </Routes>
        </div>

        <footer className="h-8 border-t border-gray-800 bg-background/80 flex items-center justify-between px-8 text-[9px] font-mono text-gray-600 uppercase tracking-widest shrink-0">
          <div>© 2026 AEGIS-AERO INTEL-SOC</div>
          <div className="flex gap-6">
            <span>SENSORS: ACTIVE</span>
            <span>SYSTEM VERSION: v1.0.0</span>
          </div>
        </footer>
        
        {/* Decorative Scan Lines */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50"></div>
      </div>
    </Router>
  );
}

export default App;
