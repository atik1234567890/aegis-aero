import React from 'react';

export interface Alert {
  id: number;
  title: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  icon: string;
}

const AlertsFeed: React.FC<{ alerts: Alert[]; threatScore?: number }> = ({ alerts, threatScore = 0 }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-accent-red border-accent-red bg-accent-red/10';
      case 'HIGH': return 'text-accent-amber border-accent-amber bg-accent-amber/10';
      case 'MEDIUM': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'LOW': return 'text-accent-green border-accent-green bg-accent-green/10';
      default: return 'text-gray-500 border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="w-80 bg-black/40 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Live Alerts</h3>
        <div className={`w-2 h-2 rounded-full bg-accent-red ${threatScore > 70 ? 'animate-ping' : 'animate-pulse'}`}></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 border rounded-sm flex flex-col gap-1 transition-all duration-300 animate-in fade-in slide-in-from-right-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold font-mono uppercase tracking-tighter">
                {alert.severity}
              </span>
              <span className="text-[10px] font-mono opacity-60">
                {alert.timestamp}
              </span>
            </div>
            <div className="text-xs font-bold leading-tight">
              {alert.title}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-800 bg-black/60 text-center">
        <button className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors">
          VIEW ALL LOGS →
        </button>
      </div>
    </div>
  );
};

export default AlertsFeed;
