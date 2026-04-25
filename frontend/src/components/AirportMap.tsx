import React from 'react';

interface Flight {
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  altitude: number;
  velocity: number;
}

interface AirportMapProps {
  flights?: Flight[];
  selectedCountry?: string;
}

const AirportMap: React.FC<AirportMapProps> = ({ flights = [], selectedCountry }) => {
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
      
      {/* Flight Markers */}
      {flights.map((flight, i) => (
        <div 
          key={i} 
          className="absolute transition-all duration-1000"
          style={{
            left: `${((flight.longitude + 180) / 360) * 100}%`,
            top: `${((90 - flight.latitude) / 180) * 100}%`
          }}
        >
          <div className="relative group cursor-pointer">
            <div className="w-2 h-2 bg-accent-green rounded-full shadow-[0_0_8px_#22c55e]"></div>
            <div className="absolute top-4 left-0 hidden group-hover:block whitespace-nowrap text-[8px] font-mono text-white bg-black/90 p-2 border border-gray-700 z-50">
              <div>CALLSIGN: {flight.callsign}</div>
              <div>COUNTRY: {flight.origin_country}</div>
              <div>ALTITUDE: {Math.round(flight.altitude)}m</div>
              <div>SPEED: {Math.round(flight.velocity * 3.6)}km/h</div>
            </div>
          </div>
        </div>
      ))}

      {/* Static Threat Markers (kept for flavor) */}
      <div className="absolute top-1/4 left-1/3 animate-bounce">
        <div className="relative">
          <div className="absolute -inset-4 bg-accent-red/20 rounded-full animate-ping"></div>
          <div className="w-3 h-3 bg-accent-red rounded-full flex items-center justify-center text-[8px] font-bold shadow-[0_0_10px_#ef4444]">
            !
          </div>
        </div>
      </div>
      
      {/* Scan Line */}
      <div className="scan-line"></div>
      
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-500">
        RADAR FEED: ACTIVE | {selectedCountry ? `COUNTRY: ${selectedCountry.toUpperCase()}` : 'SECTOR: GLOBAL'}
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-accent-green">
        TRACKING: {flights.length} OBJECTS
      </div>
    </div>
  );
};

export default AirportMap;
