import { useState, useEffect } from 'react';
import ThreatScore from '../components/ThreatScore';
import AirportMap from '../components/AirportMap';
import AlertsFeed from '../components/AlertsFeed';
import type { Alert } from '../components/AlertsFeed';
import ModuleStatus from '../components/ModuleStatus';
import type { Module } from '../components/ModuleStatus';

const Dashboard = () => {
  const [threatScore, setThreatScore] = useState(42);
  const [nexusAnalysis, setNexusAnalysis] = useState('Initializing security systems...');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [modules, setModules] = useState<Module[]>([
    { id: 'darkhawk', name: 'DarkHawk (Drone)', status: 'ACTIVE', progress: 98 },
    { id: 'threatvision', name: 'ThreatVision (X-Ray)', status: 'SCANNING', progress: 65 },
    { id: 'cyberguard', name: 'CyberGuard (IDS)', status: 'MONITORING', progress: 92 },
    { id: 'perimetermind', name: 'PerimeterMind', status: 'ACTIVE', progress: 88 },
  ]);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/live';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setThreatScore(data.threat_score);
      setNexusAnalysis(data.nexus_analysis);
      if (data.alerts) setAlerts(data.alerts);
      
      const updatedModules: Module[] = [
        { id: 'darkhawk', name: 'DarkHawk (Drone)', status: data.active_modules.darkhawk.status, progress: data.active_modules.darkhawk.integrity },
        { id: 'threatvision', name: 'ThreatVision (X-Ray)', status: data.active_modules.threatvision.status, progress: data.active_modules.threatvision.integrity },
        { id: 'cyberguard', name: 'CyberGuard (IDS)', status: data.active_modules.cyberguard.status, progress: data.active_modules.cyberguard.integrity },
        { id: 'perimetermind', name: 'PerimeterMind', status: data.active_modules.perimetermind.status, progress: data.active_modules.perimetermind.integrity },
      ];
      setModules(updatedModules);
    };

    return () => ws.close();
  }, []);

  return (
    <main className="p-6 flex flex-col gap-6 h-full overflow-hidden relative">
      {/* Sound Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`p-2 rounded border transition-all duration-300 ${isSoundEnabled ? 'border-accent-green/50 text-accent-green bg-accent-green/10' : 'border-gray-800 text-gray-500 bg-black/40'}`}
        >
          {isSoundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex flex-col gap-6">
          <ThreatScore score={threatScore} />
          <div className="flex-1 bg-black/20 border border-gray-800 rounded-lg p-4 font-mono text-[10px] text-gray-500 overflow-hidden">
            <div className="flex items-center justify-between mb-2 border-b border-gray-800 pb-1">
               <div className="text-accent-green tracking-widest uppercase">System Logs</div>
               {threatScore > 70 && <div className="w-2 h-2 bg-accent-red rounded-full animate-ping"></div>}
            </div>
            <div className="space-y-1">
              <div>[OK] Kernel modules loaded</div>
              <div>[OK] DarkHawk-v4 initialized</div>
              <div>[OK] Neural network sync: 99.8%</div>
              <div className="text-accent-amber">[WARN] Latency in Sector 4</div>
              <div>[OK] Encryption handshake complete</div>
              <div className="animate-pulse text-white">_</div>
            </div>
          </div>
        </div>
        <AirportMap />
        <AlertsFeed alerts={alerts} threatScore={threatScore} />
      </div>
      <div className="flex gap-6 items-end pb-4">
        <ModuleStatus modules={modules} />
        <div className="w-80 h-32 bg-black/60 border border-accent-red/30 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-red/50"></div>
          <div className="text-[10px] font-mono text-accent-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></span>
            NEXUS AI v4.0
          </div>
          <div className="text-[11px] font-mono text-gray-300 leading-relaxed">
            {nexusAnalysis}
            <span className="inline-block w-2 h-4 bg-accent-red/50 ml-1 animate-pulse"></span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
