import React, { useState, useEffect } from 'react';

const ThreatScore: React.FC<{ score: number }> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(score);
  const isCritical = score > 80;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const startValue = displayScore;
    const endValue = score;
    const diff = endValue - startValue;

    if (diff === 0) return;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const nextValue = Math.round(startValue + diff * easedProgress);
      
      setDisplayScore(nextValue);

      if (currentStep >= steps) {
        setDisplayScore(endValue);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [score]);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-gray-800 rounded-lg relative overflow-hidden">
      <div className="text-xs text-gray-500 font-mono uppercase mb-4 tracking-widest">Global Threat Index</div>
      
      <div className="relative">
        {/* Animated Pulse Ring */}
        {isCritical && (
          <div className="absolute inset-0 rounded-full pulse-critical"></div>
        )}
        
        {/* Circular Score */}
        <div className="w-48 h-48 rounded-full border-4 border-gray-800 flex flex-col items-center justify-center relative z-10 bg-background">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="90"
              fill="transparent"
              stroke={isCritical ? '#ef4444' : '#22c55e'}
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - displayScore / 100)}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <span className="text-6xl font-bold font-mono text-white">{displayScore}</span>
          <span className="text-xs text-gray-500 font-mono uppercase">Severity</span>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-6 rounded-sm ${i < displayScore / 10 ? (isCritical ? 'bg-accent-red' : 'bg-accent-green') : 'bg-gray-800'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreatScore;
