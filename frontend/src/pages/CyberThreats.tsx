import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
  PieChart, Pie, Cell
} from 'recharts';

interface NetworkEvent {
  id: string;
  timestamp: string;
  ip: string;
  type: 'ARP_POISON' | 'PORT_SCAN' | 'DOS_ATTEMPT' | 'NORMAL_TRAFFIC';
  status: 'BLOCKED' | 'NORMAL' | 'SUSPICIOUS';
}

const CyberThreats = () => {
  const [intrusionCount, setIntrusionCount] = useState(142);
  const [gpsData, setGpsData] = useState<{ time: number; drift: number }[]>([]);
  const [currentDrift, setCurrentDrift] = useState(47.3);
  const [networkLogs, setNetworkLogs] = useState<NetworkEvent[]>([]);
  const [metrics, setMetrics] = useState({
    packetsPerSec: 1240,
    blockedAttacks: 89,
    activeConnections: 542
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialGps = Array.from({ length: 60 }, (_, i) => ({
      time: i,
      drift: 2 + Math.random() * 5
    }));
    setGpsData(initialGps);

    const initialLogs: NetworkEvent[] = [
      { id: '1', timestamp: '20:45:01', ip: '192.168.1.104', type: 'NORMAL_TRAFFIC', status: 'NORMAL' },
      { id: '2', timestamp: '20:45:15', ip: '45.12.8.22', type: 'PORT_SCAN', status: 'BLOCKED' },
    ];
    setNetworkLogs(initialLogs);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntrusionCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      setMetrics(prev => ({
        packetsPerSec: Math.floor(1200 + Math.random() * 200),
        blockedAttacks: prev.blockedAttacks + (Math.random() > 0.9 ? 1 : 0),
        activeConnections: Math.floor(540 + Math.random() * 20)
      }));

      setCurrentDrift(prev => {
        const targetDrift = Math.random() > 0.95 ? 40 + Math.random() * 20 : 2 + Math.random() * 8;
        const newDrift = prev + (targetDrift - prev) * 0.2;
        setGpsData(prevData => {
          const newData = [...prevData.slice(1), { time: prevData[prevData.length-1].time + 1, drift: newDrift }];
          return newData;
        });
        return newDrift;
      });

      if (Math.random() > 0.5) {
        const types: NetworkEvent['type'][] = ['ARP_POISON', 'PORT_SCAN', 'DOS_ATTEMPT', 'NORMAL_TRAFFIC'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newLog: NetworkEvent = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
          type: type,
          status: type === 'NORMAL_TRAFFIC' ? 'NORMAL' : (Math.random() > 0.3 ? 'BLOCKED' : 'SUSPICIOUS')
        };
        setNetworkLogs(prev => [...prev.slice(-49), newLog]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [networkLogs]);

  const donutData = [
    { name: 'GPS Spoofing', value: 35, color: '#ef4444' },
    { name: 'ARP Poisoning', value: 20, color: '#f59e0b' },
    { name: 'DOS Attack', value: 15, color: '#ef4444' },
    { name: 'Port Scanning', value: 18, color: '#3b82f6' },
    { name: 'Normal', value: 12, color: '#22c55e' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'BLOCKED': return 'text-accent-red';
      case 'SUSPICIOUS': return 'text-accent-amber';
      case 'NORMAL': return 'text-accent-green';
      default: return 'text-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'DOS_ATTEMPT':
      case 'ARP_POISON': return 'text-accent-red';
      case 'PORT_SCAN': return 'text-accent-amber';
      default: return 'text-gray-400';
    }
  };

  return (
    <main className="p-6 flex flex-col gap-6 h-full overflow-hidden">
      {/* Top - Network Status Bar */}
      <div className="flex gap-4 w-full">
        <div className="flex-1 bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="text-[9px] font-mono text-gray-500 uppercase">ATC Network</div>
              <div className="text-xs font-bold font-mono text-accent-green flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full"></span>
                SECURE
              </div>
            </div>
            <div className="w-px h-6 bg-gray-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-[9px] font-mono text-gray-500 uppercase">GPS Signal</div>
              <div className={`text-xs font-bold font-mono flex items-center gap-2 ${currentDrift > 15 ? 'text-accent-red' : 'text-accent-green'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentDrift > 15 ? 'bg-accent-red animate-pulse' : 'bg-accent-green'}`}></span>
                {currentDrift > 15 ? 'ANOMALY DETECTED' : 'NOMINAL'}
              </div>
            </div>
            <div className="w-px h-6 bg-gray-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Firewall</div>
              <div className="text-xs font-bold font-mono text-accent-green">ACTIVE</div>
            </div>
            <div className="w-px h-6 bg-gray-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Intrusions Today</div>
              <div className="text-xs font-bold font-mono text-white">{intrusionCount}</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-gray-600 bg-gray-900/50 px-2 py-1 rounded border border-gray-800">
            SECURE LINK: ESTABLISHED
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - GPS Spoofing Monitor */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 border border-gray-800 rounded-lg p-4 flex-1 flex flex-col">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">GPS Drift Analysis</h3>
            
            <div className="flex-1 min-h-[150px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <ReferenceArea y1={0} y2={15} fill="#22c55e10" />
                  <ReferenceArea y1={15} y2={100} fill="#ef444410" />
                  <Line 
                    type="basis" 
                    dataKey="drift" 
                    stroke={currentDrift > 15 ? '#ef4444' : '#22c55e'} 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 text-right">
                <div className={`text-3xl font-bold font-mono leading-none transition-colors duration-500 ${currentDrift > 15 ? 'text-accent-red' : 'text-white'}`}>{currentDrift.toFixed(1)}m</div>
                <div className="text-[9px] font-mono text-gray-500 uppercase">Current Drift</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
              <div className={`text-center py-2 rounded text-[11px] font-bold font-mono border transition-colors duration-500 ${
                currentDrift > 15 ? 'bg-accent-red/20 text-accent-red border-accent-red/30' : 'bg-accent-green/10 text-accent-green border-accent-green/20'
              }`}>
                {currentDrift > 15 ? '⚠ SPOOFING DETECTED' : '✓ SIGNAL NOMINAL'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="text-gray-600">AFFECTED FLIGHTS:</div>
                <div className="text-white text-right">{currentDrift > 15 ? '04' : '00'}</div>
                <div className="text-gray-600">EST. SOURCE:</div>
                <div className="text-white text-right">285° NW</div>
              </div>
              <div className="flex justify-between items-center bg-black/60 p-2 rounded border border-gray-800">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Drift Index (GDI)</span>
                <span className={`px-2 py-0.5 text-black text-[10px] font-bold rounded ${currentDrift > 15 ? 'bg-accent-red' : 'bg-accent-green'}`}>{(currentDrift/10 + 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Live Network Traffic */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Packets/Sec', value: metrics.packetsPerSec, color: 'text-blue-400' },
              { label: 'Blocked Attacks', value: metrics.blockedAttacks, color: 'text-accent-red' },
              { label: 'Active Conns', value: metrics.activeConnections, color: 'text-accent-green' }
            ].map((m, i) => (
              <div key={i} className="bg-black/40 border border-gray-800 p-3 rounded-lg flex flex-col items-center">
                <span className="text-[9px] font-mono text-gray-600 uppercase mb-1">{m.label}</span>
                <span className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-black/40 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-black/20">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Network Intrusion Detection (IDS)</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></div>
                <span className="text-[9px] font-mono text-accent-red uppercase">Live Analysis</span>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-[10px] scrollbar-hide space-y-1">
              {networkLogs.map((log) => (
                <div key={log.id} className="flex gap-4 border-b border-gray-900/50 pb-1 hover:bg-white/5 transition-colors">
                  <span className="text-gray-600">[{log.timestamp}]</span>
                  <span className="text-blue-400 w-28">{log.ip}</span>
                  <span className={`w-32 ${getTypeColor(log.type)}`}>{log.type}</span>
                  <span className={`ml-auto font-bold ${getStatusColor(log.status)}`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Threat Classification */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 border border-gray-800 rounded-lg p-4 flex-1 flex flex-col">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">AI Threat Classifier</h3>
            
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #333', fontSize: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Accuracy</div>
                <div className="text-sm font-bold font-mono text-accent-green">94.7%</div>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-hidden flex flex-col">
              <div className="text-[10px] font-mono text-gray-600 uppercase mb-2 border-b border-gray-800 pb-1">Recent Classified</div>
              <div className="space-y-2 overflow-y-auto scrollbar-hide flex-1">
                {networkLogs.filter(l => l.status !== 'NORMAL').slice(0, 4).map((l) => (
                  <div key={l.id} className="bg-black/60 border border-gray-800 p-2 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white">{l.type}</span>
                      <span className="text-[9px] font-mono text-accent-green">98.2% CONF.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-gray-600">{l.timestamp}</span>
                      <div className="flex gap-1">
                        <button className="text-[8px] font-mono bg-accent-red/20 text-accent-red px-1 rounded border border-accent-red/30">BLOCK</button>
                        <button className="text-[8px] font-mono bg-gray-800 text-gray-400 px-1 rounded">MONITOR</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex gap-6 items-end pb-4">
        {/* Attack Timeline */}
        <div className="flex-1 bg-black/40 border border-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Attack Timeline (24H)</h3>
            <span className="text-[10px] font-mono text-accent-amber">PEAK ATTACK: 03:00-04:00 AM</span>
          </div>
          <div className="h-12 flex items-end gap-1 px-2">
            {[...Array(48)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-sm transition-all hover:opacity-100 ${
                  i > 6 && i < 12 ? 'bg-accent-red opacity-80 h-10' : 
                  i > 30 && i < 35 ? 'bg-accent-amber opacity-60 h-6' : 
                  'bg-gray-800 opacity-30 h-2'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[8px] font-mono text-gray-600">
            <span>24H AGO</span>
            <span>12H AGO</span>
            <span>CURRENT</span>
          </div>
        </div>

        {/* NEXUS AI Analysis */}
        <div className="w-80 h-32 bg-black/60 border border-accent-red/30 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-red/50"></div>
          <div className="text-[10px] font-mono text-accent-red mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></span>
            NEXUS CYBER v4.2
          </div>
          <div className="text-[10px] font-mono text-gray-300 leading-relaxed italic">
            "Coordinated attack pattern detected. GPS spoofing correlates with network intrusion attempt. Possible state-level threat actor. Recommend: Activate backup navigation systems and initiate sector-wide network isolation."
          </div>
          <div className="mt-2 text-[9px] font-mono text-accent-red uppercase font-bold text-right">SYSTEM ALERT: CRITICAL</div>
        </div>
      </div>
    </main>
  );
};

export default CyberThreats;
