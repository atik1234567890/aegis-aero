import React from 'react';

const AirportMap: React.FC = () => {
  return (
    <div className="flex-1 bg-black/40 border border-gray-800 rounded-lg relative overflow-hidden min-h-[400px]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      {/* Runway Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
          {/* Main Runway */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -rotate-12">
            <div className="absolute inset-0 border-t border-dashed border-gray-500 mt-[-2px]"></div>
          </div>
          {/* Cross Runway */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gray-700 rotate-45">
            <div className="absolute inset-0 border-l border-dashed border-gray-500 ml-[-2px]"></div>
          </div>
        </div>
      </div>
      
      {/* Threat Markers */}
      <div className="absolute top-1/4 left-1/3 animate-bounce">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent-red/20 rounded-full animate-ping"></div>
          <div className="w-4 h-4 bg-accent-red rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_0_10px_#ef4444]">
            !
          </div>
          <div className="absolute top-6 left-0 whitespace-nowrap text-[10px] font-mono text-accent-red bg-black/80 px-1 border border-accent-red">
            DRONE DETECTED
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-1/3 right-1/4">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent-amber/20 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-accent-amber rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_0_10px_#f59e0b]">
            ?
          </div>
          <div className="absolute top-6 left-0 whitespace-nowrap text-[10px] font-mono text-accent-amber bg-black/80 px-1 border border-accent-amber">
            GPS ANOMALY
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 right-1/2">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent-green/20 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-accent-green rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_0_10px_#22c55e]">
            P
          </div>
          <div className="absolute top-6 left-0 whitespace-nowrap text-[10px] font-mono text-accent-green bg-black/80 px-1 border border-accent-green">
            PERIMETER OK
          </div>
        </div>
      </div>
      
      {/* Scan Line */}
      <div className="scan-line"></div>
      
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-500">
        RADAR FEED: ACTIVE | SECTOR: NORTH-EAST
      </div>
    </div>
  );
};

export default AirportMap;
