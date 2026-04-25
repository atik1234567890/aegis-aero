import React, { useState, useEffect } from 'react';

const NexusAI: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "NEXUS AI ANALYSIS: Patterns suggest potential coordinated intrusion in Sector 7. DarkHawk drone detection synchronized with PerimeterMind underground sensors. Escalating threat level to HIGH. Recommended action: Deploy rapid response team to North Fence.";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        setTimeout(() => { index = 0; }, 5000); // Pause and restart
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 h-32 bg-black/60 border border-accent-red/30 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-red/50"></div>
      <div className="text-[10px] font-mono text-accent-red mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></span>
        NEXUS AI v4.0
      </div>
      <div className="text-[11px] font-mono text-gray-300 leading-relaxed">
        {text}
        <span className="inline-block w-2 h-4 bg-accent-red/50 ml-1 animate-pulse"></span>
      </div>
    </div>
  );
};

export default NexusAI;
