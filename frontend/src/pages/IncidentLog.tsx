import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface Incident {
  id: string;
  timestamp: string;
  module: 'DarkHawk' | 'ThreatVision' | 'CyberGuard' | 'PerimeterMind';
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  description: string;
  detectionMethod: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  incidentId: string;
  time: string;
}

const IncidentLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL MODULES');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Incident; direction: 'asc' | 'desc' } | null>(null);
  
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', user: 'Officer Chen', action: 'marked incident as resolved', incidentId: '#AF3E21', time: '2 mins ago' },
    { id: '2', user: 'NEXUS AI', action: 'escalated incident', incidentId: '#BB1290', time: '5 mins ago' },
    { id: '3', user: 'System', action: 'detected new threat', incidentId: '#DX-404', time: '12 mins ago' },
  ]);

  const mockIncidents: Incident[] = useMemo(() => [
    { id: '#AF3E21', timestamp: '2026-04-25 14:22:05', module: 'DarkHawk', type: 'Unidentified Drone', severity: 'CRITICAL', location: 'Sector 7 (North)', status: 'RESOLVED', description: 'Class IV multi-rotor drone detected within restricted perimeter. RF jamming initiated.', detectionMethod: 'RF Signature + Acoustic' },
    { id: '#BB1290', timestamp: '2026-04-25 14:15:30', module: 'CyberGuard', type: 'GPS Spoofing', severity: 'HIGH', location: 'Approach Path Rwy 09', status: 'INVESTIGATING', description: 'Coordinated GPS drift detected affecting multiple landing aircraft. Signal source estimated NW.', detectionMethod: 'Drift Index Analysis' },
    { id: '#DX-404', timestamp: '2026-04-25 14:02:12', module: 'ThreatVision', type: 'Weapon Detected', severity: 'CRITICAL', location: 'Terminal 3 Gate B4', status: 'OPEN', description: 'AI analysis identified metallic firearm profile in carry-on luggage. Rapid response team notified.', detectionMethod: 'X-Ray AI Neural Net' },
    { id: '#PM-772', timestamp: '2026-04-25 13:45:00', module: 'PerimeterMind', type: 'Vibration Alert', severity: 'MEDIUM', location: 'Fuel Farm Perimeter', status: 'RESOLVED', description: 'Underground seismic sensors triggered by heavy vehicle movement. Visual verification confirmed maintenance crew.', detectionMethod: 'Seismic Array' },
    { id: '#CG-102', timestamp: '2026-04-25 13:20:15', module: 'CyberGuard', type: 'DoS Attempt', severity: 'HIGH', location: 'Internal ATC Network', status: 'INVESTIGATING', description: 'High-volume SYN flood detected targeting primary flight data servers. Mitigation filters active.', detectionMethod: 'Network Flow IDS' },
    { id: '#DH-552', timestamp: '2026-04-25 12:55:40', module: 'DarkHawk', type: 'Authorized Drone', severity: 'LOW', location: 'Runway 27L', status: 'RESOLVED', description: 'Airport maintenance drone active for lighting inspection. Remote ID verified.', detectionMethod: 'Remote ID Broadcast' },
    { id: '#TV-881', timestamp: '2026-04-25 12:30:22', module: 'ThreatVision', type: 'Lithium Battery', severity: 'MEDIUM', location: 'Cargo Area D', status: 'OPEN', description: 'Bulk lithium shipment identified without proper hazardous materials labeling.', detectionMethod: 'Material Discrimination' },
    { id: '#AF-332', timestamp: '2026-04-25 11:45:10', module: 'PerimeterMind', type: 'Fence Breach', severity: 'HIGH', location: 'South Boundary G2', status: 'RESOLVED', description: 'Optical sensors detected breach of secondary perimeter fence. Patrol team secured area.', detectionMethod: 'Visual Tracking (LIDAR)' },
    { id: '#DX-990', timestamp: '2026-04-25 11:12:05', module: 'DarkHawk', type: 'Signal Jamming', severity: 'CRITICAL', location: 'Control Tower Area', status: 'INVESTIGATING', description: 'Localized broadband noise detected on telemetry frequencies. Jamming source triangulation in progress.', detectionMethod: 'Spectrum Analysis' },
    { id: '#CG-445', timestamp: '2026-04-25 10:55:00', module: 'CyberGuard', type: 'Port Scan', severity: 'LOW', location: 'Public Wi-Fi Bridge', status: 'RESOLVED', description: 'Sequential scanning of internal port range detected from public subnet. IP blocked.', detectionMethod: 'Packet Inspection' },
    { id: '#PM-112', timestamp: '2026-04-25 10:20:33', module: 'PerimeterMind', type: 'Underground Tunneling', severity: 'CRITICAL', location: 'Sector 4 East', status: 'OPEN', description: 'Acoustic pattern correlates with manual excavation activity near restricted zone.', detectionMethod: 'Seismic Acoustic Fusion' },
    { id: '#TV-221', timestamp: '2026-04-25 09:45:15', module: 'ThreatVision', type: 'Organic Threat', severity: 'HIGH', location: 'Terminal 1 Arrivals', status: 'INVESTIGATING', description: 'Detection of prohibited organic substances in agricultural shipment.', detectionMethod: 'Atomic Number Z-Effective' },
  ], []);

  const statsData = [
    { day: 'Mon', count: 12, critical: 2, high: 4, medium: 6 },
    { day: 'Tue', count: 18, critical: 5, high: 6, medium: 7 },
    { day: 'Wed', count: 15, critical: 3, high: 5, medium: 7 },
    { day: 'Thu', count: 22, critical: 6, high: 8, medium: 8 },
    { day: 'Fri', count: 14, critical: 2, high: 4, medium: 8 },
    { day: 'Sat', count: 9, critical: 1, high: 3, medium: 5 },
    { day: 'Sun', count: 11, critical: 2, high: 4, medium: 5 },
  ];

  const threatDistribution = [
    { type: 'Drone Incursion', value: 45, color: '#ef4444' },
    { type: 'GPS Anomaly', value: 28, color: '#f59e0b' },
    { type: 'Network Attack', value: 18, color: '#3b82f6' },
    { type: 'Perimeter Breach', value: 9, color: '#22c55e' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['Officer Chen', 'Agent Smith', 'NEXUS AI', 'Dispatcher Lee'];
      const actions = ['resolved incident', 'updated status of', 'added note to', 'escalated'];
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const incident = mockIncidents[Math.floor(Math.random() * mockIncidents.length)];
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        user,
        action: `${action} incident`,
        incidentId: incident.id,
        time: 'Just now'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [mockIncidents]);

  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter(inc => {
      const matchesSearch = inc.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inc.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
      const matchesModule = moduleFilter === 'ALL MODULES' || inc.module === moduleFilter;
      return matchesSearch && matchesSeverity && matchesModule;
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [mockIncidents, searchTerm, severityFilter, moduleFilter, sortConfig]);

  const requestSort = (key: keyof Incident) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-accent-red text-black font-bold';
      case 'HIGH': return 'bg-accent-amber text-black font-bold';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      case 'LOW': return 'bg-accent-green/20 text-accent-green border border-accent-green/30';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const getModuleColor = (mod: string) => {
    switch(mod) {
      case 'DarkHawk': return 'text-accent-red border-accent-red/30';
      case 'ThreatVision': return 'text-blue-400 border-blue-400/30';
      case 'CyberGuard': return 'text-accent-amber border-accent-amber/30';
      case 'PerimeterMind': return 'text-accent-green border-accent-green/30';
      default: return 'text-gray-400 border-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'text-accent-red';
      case 'INVESTIGATING': return 'text-accent-amber';
      case 'RESOLVED': return 'text-accent-green';
      default: return 'text-gray-500';
    }
  };

  return (
    <main className="pt-20 p-6 flex flex-col gap-6 h-[calc(100vh-80px)] overflow-hidden bg-background text-white font-sans relative">
      {/* Top - Filter & Search Bar */}
      <div className="bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search incidents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-xs font-mono focus:border-accent-red outline-none transition-colors pl-8"
            />
            <svg className="w-4 h-4 absolute left-2.5 top-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="flex bg-black border border-gray-700 rounded overflow-hidden">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button 
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 text-[10px] font-mono border-r border-gray-700 last:border-0 transition-all ${
                  severityFilter === sev 
                    ? (sev === 'CRITICAL' ? 'bg-accent-red text-black' : 
                       sev === 'HIGH' ? 'bg-accent-amber text-black' : 
                       sev === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                       sev === 'LOW' ? 'bg-accent-green text-black' : 'bg-gray-600 text-white')
                    : 'text-gray-500 hover:bg-gray-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <select 
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-black border border-gray-700 rounded px-3 py-1.5 text-xs font-mono text-gray-400 focus:border-accent-red outline-none"
          >
            {['ALL MODULES', 'DarkHawk', 'ThreatVision', 'CyberGuard', 'PerimeterMind'].map(mod => (
              <option key={mod} value={mod}>{mod.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500">TOTAL:</span>
            <span className="text-xs font-bold font-mono text-white">{filteredIncidents.length}</span>
          </div>
          <button className="px-4 py-1.5 bg-accent-amber/20 border border-accent-amber/40 text-accent-amber text-[10px] font-bold uppercase rounded hover:bg-accent-amber/30 transition-all">Export PDF</button>
          <button className="px-4 py-1.5 bg-accent-green/20 border border-accent-green/40 text-accent-green text-[10px] font-bold uppercase rounded hover:bg-accent-green/30 transition-all">Export CSV</button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Side - Statistics */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-black/40 border border-gray-800 p-4 rounded-lg flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Incident Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-2 bg-black/60 border border-gray-800 rounded">
                <div className="text-[9px] font-mono text-gray-600 uppercase">Today</div>
                <div className="text-xl font-bold font-mono text-white">24</div>
              </div>
              <div className="p-2 bg-black/60 border border-gray-800 rounded">
                <div className="text-[9px] font-mono text-gray-600 uppercase">This Week</div>
                <div className="text-xl font-bold font-mono text-white">142</div>
              </div>
              <div className="p-2 bg-black/60 border border-gray-800 rounded">
                <div className="text-[9px] font-mono text-gray-600 uppercase">Resolution</div>
                <div className="text-xl font-bold font-mono text-accent-green">87%</div>
              </div>
              <div className="p-2 bg-black/60 border border-gray-800 rounded">
                <div className="text-[9px] font-mono text-gray-600 uppercase">Avg Resp</div>
                <div className="text-xl font-bold font-mono text-blue-400">4.2m</div>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Last 7 Days (Severity Mix)</div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <XAxis dataKey="day" hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid #333', fontSize: '9px' }}
                      cursor={{ fill: '#ffffff10' }}
                    />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                    <Bar dataKey="high" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="medium" stackId="a" fill="#eab308" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-3">Top Threats (Weekly)</div>
              <div className="space-y-3">
                {threatDistribution.map((threat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono uppercase">
                      <span className="text-gray-400">{threat.type}</span>
                      <span className="text-white">{threat.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${threat.value}%`, backgroundColor: threat.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Incident Table */}
        <div className="flex-1 bg-black/40 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1 scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800">
                <tr className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                  <th onClick={() => requestSort('id')} className="p-4 cursor-pointer hover:text-white">ID</th>
                  <th onClick={() => requestSort('timestamp')} className="p-4 cursor-pointer hover:text-white">Timestamp</th>
                  <th onClick={() => requestSort('module')} className="p-4 cursor-pointer hover:text-white">Module</th>
                  <th onClick={() => requestSort('type')} className="p-4 cursor-pointer hover:text-white">Threat Type</th>
                  <th onClick={() => requestSort('severity')} className="p-4 cursor-pointer hover:text-white">Severity</th>
                  <th onClick={() => requestSort('location')} className="p-4 cursor-pointer hover:text-white">Location</th>
                  <th onClick={() => requestSort('status')} className="p-4 cursor-pointer hover:text-white">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/50">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="text-[11px] font-mono hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-gray-400">{inc.id}</td>
                    <td className="p-4 text-gray-500">{inc.timestamp.split(' ')[1]}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm border text-[9px] ${getModuleColor(inc.module)}`}>
                        {inc.module.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-300">{inc.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] ${getSeverityColor(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{inc.location}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 ${getStatusColor(inc.status)}`}>
                        <div className={`w-1 h-1 rounded-full bg-current ${inc.status !== 'RESOLVED' ? 'animate-pulse' : ''}`}></div>
                        {inc.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setSelectedIncident(inc)}
                        className="px-3 py-1 bg-gray-800 text-white border border-gray-700 rounded text-[9px] uppercase font-bold hover:bg-accent-red hover:border-accent-red hover:text-black transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom - Activity Feed */}
      <div className="bg-black/40 border border-gray-800 p-3 rounded-lg flex items-center gap-6 overflow-hidden">
        <div className="flex items-center gap-2 border-r border-gray-800 pr-6 shrink-0">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Live Activity</span>
        </div>
        <div className="flex-1 flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {activities.map((act) => (
            <div key={act.id} className="flex items-center gap-2 text-[10px] font-mono">
              <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[8px] font-bold border border-gray-700 uppercase">
                {act.user.charAt(act.user.includes(' ') ? act.user.indexOf(' ')+1 : 0)}
              </div>
              <span className="text-white font-bold">{act.user}</span>
              <span className="text-gray-500">{act.action}</span>
              <span className="text-accent-amber font-bold">{act.incidentId}</span>
              <span className="text-[8px] text-gray-700">({act.time})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Detail Sidebar */}
      {selectedIncident && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-background border-l border-gray-800 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold font-mono text-white">{selectedIncident.id}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityColor(selectedIncident.severity)}`}>
                {selectedIncident.severity}
              </span>
            </div>
            <button onClick={() => setSelectedIncident(null)} className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Module Detected</div>
                <div className={`text-xs font-bold font-mono border-b pb-1 ${getModuleColor(selectedIncident.module)}`}>
                  {selectedIncident.module.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Full Timestamp</div>
                <div className="text-xs font-bold font-mono text-white border-b pb-1">
                  {selectedIncident.timestamp}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Detection Method</div>
                <div className="text-xs font-bold font-mono text-blue-400">
                  {selectedIncident.detectionMethod}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Current Status</div>
                <div className={`text-xs font-bold font-mono ${getStatusColor(selectedIncident.status)}`}>
                  {selectedIncident.status}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-black/60 border border-gray-800 rounded">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Threat Description</div>
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                {selectedIncident.description}
              </p>
            </div>

            {/* Timeline */}
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">Incident Timeline</div>
              <div className="space-y-4">
                {[
                  { label: 'Detected', time: '14:22:05', done: true },
                  { label: 'Analyzed', time: '14:22:10', done: true },
                  { label: 'Alerted', time: '14:22:12', done: true },
                  { label: 'Response Dispatched', time: '14:23:45', done: selectedIncident.status !== 'OPEN' },
                  { label: 'Resolved', time: '14:35:00', done: selectedIncident.status === 'RESOLVED' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    {i !== 4 && <div className="absolute left-2 top-4 bottom-[-16px] w-px bg-gray-800"></div>}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.done ? 'bg-accent-green' : 'bg-gray-800'
                    }`}>
                      {step.done && <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                    <div className="flex-1">
                      <div className={`text-[11px] font-bold ${step.done ? 'text-white' : 'text-gray-600'}`}>{step.label}</div>
                      <div className="text-[9px] font-mono text-gray-500">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEXUS Analysis */}
            <div className="p-4 bg-accent-red/10 border border-accent-red/30 rounded relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-red/50"></div>
              <div className="text-[9px] font-mono text-accent-red mb-2 uppercase font-bold tracking-widest">NEXUS AI CYBER ANALYSIS</div>
              <p className="text-[11px] text-gray-300 font-mono italic leading-relaxed">
                "Pattern correlates with known state-actor intrusion profile #APT-41. Coordinated timing with GPS drift indicates a tactical penetration attempt. Recommend immediate escalation to National Security Operations."
              </p>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-800 space-y-4">
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-accent-green text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-accent-green/80 transition-all">Mark Resolved</button>
                <button className="flex-1 py-3 bg-accent-red text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-accent-red/80 transition-all">Escalate</button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Add investigator note..." 
                  className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-xs font-mono outline-none focus:border-accent-amber"
                />
                <button className="absolute right-2 top-2 px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold uppercase rounded hover:text-white transition-all">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
};

export default IncidentLog;
