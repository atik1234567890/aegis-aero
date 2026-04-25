import { useState, useEffect } from 'react';
import client from '../api/client';

interface Drone {
  id: string;
  type: 'DARK' | 'UNIDENTIFIED' | 'AUTHORIZED';
  threat_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  position: { x: number; y: number };
  speed: number;
  altitude: number;
  bearing: number;
  rf_detected: boolean;
  acoustic_confidence: number;
}

const DroneMonitor = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [actionLog, setActionLog] = useState<{ msg: string; time: string }[]>([
    { msg: 'System initialized. Airspace restricted.', time: '20:45:01' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('/api/drone/tracks');
        setDrones(response.data);
        setTimestamp(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Failed to fetch drone tracks", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getDroneColor = (type: string) => {
    switch (type) {
      case 'DARK': return 'bg-accent-red border-white shadow-[0_0_10px_#ef4444]';
      case 'UNIDENTIFIED': return 'bg-accent-amber border-white animate-pulse shadow-[0_0_10px_#f59e0b]';
      default: return 'bg-accent-green border-white';
    }
  };

  const addLog = (msg: string) => {
    setActionLog(prev => [{ msg, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
  };

  return (
    <main className="p-6 pt-20 flex flex-col gap-6 h-full overflow-hidden">
      {/* Top Status Bar */}
      <div className="flex gap-4 w-full">
        <div className="flex-1 bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[9px] font-mono text-gray-500 uppercase">Airspace Status</div>
              <div className="text-sm font-bold font-mono text-accent-red flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></span>
                RESTRICTED
              </div>
            </div>
            <div className="w-px h-8 bg-gray-800"></div>
            <div>
              <div className="text-[9px] font-mono text-gray-500 uppercase">Active Tracks</div>
              <div className="text-sm font-bold font-mono text-white">0{drones.length}</div>
            </div>
            <div className="w-px h-8 bg-gray-800"></div>
            <div>
              <div className="text-[9px] font-mono text-gray-500 uppercase">Detection Range</div>
              <div className="text-sm font-bold font-mono text-white">5.2 KM RADIUS</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono text-gray-500 uppercase">Last Updated</div>
            <div className="text-sm font-bold font-mono text-gray-300">{timestamp}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Drone Classification */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest px-1">Classification</h3>
          
          <div className="space-y-4">
            {drones.map(drone => (
              <div key={drone.id} className={`bg-black/60 border ${
                drone.threat_level === 'CRITICAL' ? 'border-accent-red/50' : 
                drone.threat_level === 'HIGH' ? 'border-accent-amber/50' : 
                'border-accent-green/50'
              } p-4 rounded-lg relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 p-1 ${
                  drone.threat_level === 'CRITICAL' ? 'bg-accent-red' : 
                  drone.threat_level === 'HIGH' ? 'bg-accent-amber' : 
                  'bg-accent-green'
                } text-black text-[8px] font-bold font-mono`}>{drone.threat_level}</div>
                <div className={`${
                  drone.type === 'DARK' ? 'text-accent-red' : 
                  drone.type === 'UNIDENTIFIED' ? 'text-accent-amber' : 
                  'text-accent-green'
                } font-mono font-bold text-xs mb-3 flex items-center gap-2`}>
                  <div className={`w-2 h-2 ${
                    drone.type === 'DARK' ? 'bg-accent-red' : 
                    drone.type === 'UNIDENTIFIED' ? 'bg-accent-amber' : 
                    'bg-accent-green'
                  } rounded-full`}></div>
                  {drone.type} DRONE ({drone.id})
                </div>
                <div className="space-y-1 text-[10px] font-mono text-gray-400">
                  <div className="flex justify-between"><span>SIGNAL:</span> <span className={drone.rf_detected ? 'text-accent-green' : 'text-accent-red'}>{drone.rf_detected ? 'RF DETECTED' : 'NO RF DETECTED'}</span></div>
                  <div className="flex justify-between"><span>CONFIDENCE:</span> <span>{(drone.acoustic_confidence * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span>SPEED:</span> <span className="text-white">{drone.speed.toFixed(1)} KM/H</span></div>
                  <div className="flex justify-between"><span>ALTITUDE:</span> <span className="text-white">{drone.altitude.toFixed(0)}M</span></div>
                  <div className="flex justify-between"><span>BEARING:</span> <span className="text-white">{drone.bearing.toFixed(0)}°</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Radar */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-black/20 border border-gray-800 rounded-lg overflow-hidden">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-gray-600 tracking-widest uppercase">Airspace Tactical Radar</div>
          
          <div className="relative w-[450px] h-[450px] rounded-full border border-accent-green/30 bg-black/40 flex items-center justify-center">
            {/* Range Rings */}
            {[100, 200, 300, 400].map((size, i) => (
              <div 
                key={i} 
                className="absolute border border-accent-green/10 rounded-full" 
                style={{ width: size, height: size }}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-accent-green/40">{i+1}KM</span>
              </div>
            ))}

            {/* Crosshair lines */}
            <div className="absolute w-full h-px bg-accent-green/10"></div>
            <div className="absolute h-full w-px bg-accent-green/10"></div>

            {/* Compass points */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-accent-green/60">N</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-accent-green/60">S</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-accent-green/60">E</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-accent-green/60">W</span>

            {/* Rotating Sweep Line */}
            <div className="absolute w-1/2 h-1/2 top-0 left-1/2 origin-bottom-left animate-[radar-sweep_4s_linear_infinite] pointer-events-none">
              <div className="w-full h-full bg-gradient-to-tr from-accent-green/20 to-transparent"></div>
              <div className="absolute right-0 top-0 w-px h-full bg-accent-green shadow-[0_0_15px_#22c55e]"></div>
            </div>

            {/* Center crosshair */}
            <div className="w-4 h-4 border border-accent-green/50 flex items-center justify-center relative z-10">
              <div className="w-1 h-1 bg-accent-green rounded-full"></div>
            </div>

            {/* Drone Markers */}
            {drones.map(drone => (
              <div 
                key={drone.id}
                className="absolute transition-all duration-1000"
                style={{
                  left: `${(drone.position.x + 1) * 50}%`,
                  top: `${(drone.position.y + 1) * 50}%`,
                }}
              >
                <div 
                  className={`w-3 h-3 rounded-sm rotate-45 border-2 ${getDroneColor(drone.type)}`}
                ></div>
                <div className="absolute top-4 left-4 whitespace-nowrap text-[8px] font-mono font-bold bg-black/80 px-1 border border-gray-700">
                  {drone.id}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 text-[8px] font-mono text-gray-600">
            AUTO-TRACKING: ON | SENSOR-FUSION: ACTIVE
          </div>
        </div>

        {/* Right Panel - Detection Methods */}
        <div className="w-80 flex flex-col gap-4">
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Sensors</h3>
          
          <div className="space-y-4 flex-1">
            {/* RF Bar Graph */}
            <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-gray-400">RF SIGNAL STRENGTH</span>
                <span className="text-[9px] font-mono text-accent-green">ACTIVE</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-accent-green/40 rounded-t-sm animate-[rf-bounce_2s_infinite_ease-in-out]"
                    style={{ 
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Acoustic Waveform */}
            <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-gray-400">ACOUSTIC ANALYSIS</span>
                <span className="text-[9px] font-mono text-accent-green">ACTIVE</span>
              </div>
              <div className="h-12 flex items-center justify-center relative overflow-hidden bg-black/20 rounded">
                <div className="w-full h-px bg-gray-800 absolute"></div>
                <div className="flex items-center gap-px w-full h-full px-2">
                  {[...Array(40)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-accent-amber/60 animate-[acoustic-wave_1.5s_infinite_ease-in-out]"
                      style={{ 
                        height: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thermal / Visual */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
                <div className="text-[10px] font-mono text-gray-400 mb-2">THERMAL</div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-red-600"></div>
                </div>
                <div className="text-[9px] font-mono text-gray-600 mt-1">74°C DETECTED</div>
              </div>
              <div className="bg-black/40 border border-gray-800 p-3 rounded-lg">
                <div className="text-[10px] font-mono text-gray-400 mb-2">OPTICAL</div>
                <div className="text-[9px] font-mono text-accent-green">LOCKED</div>
                <div className="text-[9px] font-mono text-gray-600 mt-1">TRACKING SECTOR NW</div>
              </div>
            </div>

            {/* Visual Feed Placeholder */}
            <div className="bg-black border border-gray-800 flex-1 rounded-lg relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]"></div>
              <div className="text-[10px] font-mono text-gray-700 tracking-widest text-center">
                CAMERA FEED - SECTOR NW<br/>
                <span className="text-[8px] opacity-50">THERMAL OVERLAY: ENABLED</span>
              </div>
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-1 h-1 bg-accent-red rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono text-accent-red">REC</span>
              </div>
              <div className="absolute bottom-2 left-2 text-[8px] font-mono text-gray-600">CAM_ID: SOC_DRN_004</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Interception */}
      <div className="bg-black/40 border border-gray-800 p-4 rounded-lg flex flex-col gap-4 pb-4">
        <div className="flex gap-4">
          <button onClick={() => addLog('Initiating target tracking...')} className="flex-1 py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-blue-600/30 transition-all">Track</button>
          <button onClick={() => addLog('RF Jamming signals deployed.')} className="flex-1 py-3 bg-accent-amber/20 border border-accent-amber/50 text-accent-amber text-xs font-bold uppercase tracking-widest rounded hover:bg-accent-amber/30 transition-all">Jam Signal</button>
          <button onClick={() => addLog('Air Traffic Control notified.')} className="flex-1 py-3 bg-orange-600/20 border border-orange-500/50 text-orange-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-orange-600/30 transition-all">Alert ATC</button>
          <button onClick={() => addLog('CRITICAL: EMERGENCY PROTOCOL ACTIVATED.')} className="flex-1 py-3 bg-accent-red text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-accent-red/80 transition-all animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]">Emergency Protocol</button>
        </div>

        <div className="h-20 bg-black/60 border border-gray-800 rounded p-2 overflow-y-auto scrollbar-hide">
          <div className="text-[9px] font-mono text-gray-600 uppercase mb-1 border-b border-gray-800 pb-1">Interception Action Log</div>
          {actionLog.map((log, i) => (
            <div key={i} className="text-[10px] font-mono flex gap-3 leading-relaxed">
              <span className="text-gray-600">[{log.time}]</span>
              <span className={log.msg.includes('CRITICAL') ? 'text-accent-red font-bold' : 'text-gray-300'}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rf-bounce {
          0%, 100% { height: 20%; opacity: 0.4; }
          50% { height: 80%; opacity: 1; }
        }
        @keyframes acoustic-wave {
          0%, 100% { height: 10%; opacity: 0.3; }
          50% { height: 90%; opacity: 0.8; }
        }
      `}</style>
    </main>
  );
};

export default DroneMonitor;
