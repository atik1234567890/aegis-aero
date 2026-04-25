import React from 'react';

export interface Module {
  id: string;
  name: string;
  status: 'SCANNING' | 'ACTIVE' | 'MONITORING';
  progress: number;
}

const ModuleStatus: React.FC<{ modules: Module[] }> = ({ modules }) => {
  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {modules.map((module) => (
        <div key={module.id} className="bg-black/40 border border-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 font-mono">{module.name}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              module.status === 'SCANNING' ? 'bg-accent-amber/20 text-accent-amber' : 
              module.status === 'ACTIVE' ? 'bg-accent-green/20 text-accent-green' : 
              'bg-blue-500/20 text-blue-400'
            }`}>
              {module.status}
            </span>
          </div>
          
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-1000 ease-in-out ${
                module.status === 'SCANNING' ? 'bg-accent-amber' : 'bg-accent-green'
              }`}
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-[10px] font-mono text-gray-600">
            <span>INTEGRITY</span>
            <span>{module.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleStatus;
