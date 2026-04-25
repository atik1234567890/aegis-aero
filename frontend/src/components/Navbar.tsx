import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC<{ threatLevel: string; isConnected: boolean; droneCount?: number }> = ({ threatLevel, isConnected, droneCount = 3 }) => {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL': return 'bg-accent-red';
      case 'HIGH': return 'bg-accent-amber';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-accent-green';
      default: return 'bg-gray-500';
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'X-Ray Scanner', path: '/xray' },
    { name: 'Drone Monitor', path: '/drones' },
    { name: 'Cyber Threats', path: '/cyber' },
    { name: 'Incident Log', path: '/logs' },
  ];

  return (
    <nav className="h-16 border-b border-gray-800 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 fixed top-0 w-full z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-accent-red rounded-sm flex items-center justify-center font-bold text-black italic group-hover:scale-110 transition-transform">A</div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            AEGIS<span className="text-accent-red">-</span>AERO
          </h1>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all relative ${
                location.pathname === link.path
                  ? 'text-accent-red border-b-2 border-accent-red'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {link.name}
              {link.name === 'Drone Monitor' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red text-black text-[8px] font-bold rounded-full flex items-center justify-center border border-black animate-pulse">
                  {droneCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-gray-800 pr-6">
           <button className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828" /></svg>
           </button>
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-accent-red animate-pulse'}`}></div>
              <span className="text-[9px] font-mono text-gray-500 uppercase">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
           </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono uppercase">System Time</div>
          <div className="text-lg font-mono text-white">{time.toLocaleTimeString()}</div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-500 font-mono uppercase">Current Threat</div>
          <div className={`px-3 py-1 rounded text-xs font-bold text-black transition-colors duration-500 ${getThreatColor(threatLevel)}`}>
            {threatLevel}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
