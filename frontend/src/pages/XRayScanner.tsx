import React, { useState, useRef, useEffect } from 'react';
import client from '../api/client';

interface Detection {
  label: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  threat_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ScanResponse {
  scan_id: string;
  timestamp: string;
  detections: Detection[];
  risk_level: 'CLEAR' | 'SUSPICIOUS' | 'CRITICAL' | 'HIGH';
  nexus_assessment: string;
}

const XRayScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ScanResponse | null>(null);
  const [stats, setStats] = useState({
    totalScans: 124,
    threatsDetected: 18,
    clearBags: 106,
    avgTime: '3.2s'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testImages = [
    { name: 'Test Image 1', url: 'https://images.unsplash.com/photo-1517146702251-2428c9460d5b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Test Image 2', url: 'https://images.unsplash.com/photo-1584936614318-f132587e76bc?auto=format&fit=crop&q=80&w=800' },
    { name: 'Test Image 3', url: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      processImageFile(uploadedFile);
    }
  };

  const processImageFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResults(null);
      performScan(uploadedFile);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const loadTestImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'test_image.jpg', { type: 'image/jpeg' });
      processImageFile(file);
    } catch (error) {
      console.error('Failed to load test image:', error);
    }
  };

  const performScan = async (uploadedFile: File) => {
    setIsScanning(true);
    
    setTimeout(async () => {
      setIsScanning(false);
      setIsAnalyzing(true);
      
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        const response = await client.post<ScanResponse>('/api/xray/scan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setResults(response.data);
        setStats(prev => ({
          ...prev,
          totalScans: prev.totalScans + 1,
          threatsDetected: response.data.detections.length > 0 ? prev.threatsDetected + 1 : prev.threatsDetected,
          clearBags: response.data.detections.length === 0 ? prev.clearBags + 1 : prev.clearBags
        }));
      } catch (error) {
        console.error('Scan failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (image && canvasRef.current && !isScanning && !isAnalyzing && results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          const maxWidth = 800;
          const maxHeight = 500;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const scaleX = width / img.width;
          const scaleY = height / img.height;
          
          results.detections.forEach(det => {
            const color = 
              det.threat_level === 'CRITICAL' ? '#ef4444' :
              det.threat_level === 'HIGH' ? '#f59e0b' :
              det.threat_level === 'MEDIUM' ? '#3b82f6' : '#22c55e';
            
            const { x, y, width: w, height: h } = det.bbox;
            const scaledX = x * scaleX;
            const scaledY = y * scaleY;
            const scaledW = w * scaleX;
            const scaledH = h * scaleY;

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
            
            ctx.fillStyle = color;
            ctx.font = 'bold 12px "Fira Code"';
            const labelText = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(labelText).width;
            ctx.fillRect(scaledX, scaledY - 20, textWidth + 8, 20);
            
            ctx.fillStyle = 'black';
            ctx.fillText(labelText, scaledX + 4, scaledY - 5);
          });
        };
      }
    }
  }, [image, isScanning, isAnalyzing, results]);

  return (
    <main className="p-6 flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Side - Upload */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 border border-gray-800 rounded-lg p-6 flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-6">ThreatVision Intake</h3>
            
            <div 
              onClick={() => !isScanning && !isAnalyzing && fileInputRef.current?.click()}
              className={`w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group ${
                isScanning || isAnalyzing ? 'border-gray-800 opacity-50 cursor-wait' : 'border-gray-700 hover:border-accent-red/50 hover:bg-accent-red/5'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isScanning || isAnalyzing ? 'bg-gray-900' : 'bg-gray-800 group-hover:bg-accent-red group-hover:text-black'
              }`}>
                {isAnalyzing ? (
                  <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                )}
              </div>
              <div className="text-xs font-mono text-gray-500 px-4">
                {isAnalyzing ? 'ANALYZING ML DATA...' : isScanning ? 'SCANNING HARDWARE...' : 'DRAG & DROP IMAGE OR CLICK'}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="mt-6 w-full space-y-4">
              <div className="text-[10px] font-mono text-gray-600 uppercase">Sample Test Assets</div>
              <div className="grid grid-cols-1 gap-2">
                {testImages.map((test, i) => (
                  <button
                    key={i}
                    onClick={() => !isScanning && !isAnalyzing && loadTestImage(test.url)}
                    className="w-full py-2 px-3 bg-gray-900/50 border border-gray-800 rounded text-[10px] font-mono text-gray-400 hover:text-white hover:border-gray-600 transition-all text-left flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full group-hover:bg-accent-red transition-colors"></span>
                    {test.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Analysis */}
        <div className="flex-1 bg-black/40 border border-gray-800 rounded-lg relative flex flex-col overflow-hidden">
          <div className="p-2 border-b border-gray-800 flex justify-between items-center bg-black/20">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">High-Resolution Neural Feed</span>
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${results ? 'bg-accent-green' : 'bg-gray-700'}`}></div>
              <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-accent-red animate-pulse' : 'bg-gray-700'}`}></div>
            </div>
          </div>
          
          <div className="flex-1 relative bg-black flex items-center justify-center p-4">
            {!image ? (
              <div className="text-gray-800 font-mono text-sm tracking-widest animate-pulse uppercase">System Ready: Waiting for Signal...</div>
            ) : (
              <div className="relative max-w-full max-h-full">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-[500px] object-contain border border-gray-900 shadow-2xl"
                />
                {(isScanning || isAnalyzing) && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-accent-green/5">
                    <div className="w-full h-1 bg-accent-green shadow-[0_0_20px_#22c55e] absolute top-0 animate-[scan-line-full_2s_linear_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/80 px-4 py-2 border border-accent-green text-accent-green font-mono text-xs tracking-widest">
                        {isScanning ? 'HARDWARE SCAN IN PROGRESS...' : 'NEXUS AI: ANALYZING PATTERNS...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Report */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-black/40 border border-gray-800 rounded-lg p-4 flex-1 flex flex-col">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">ML Detection Report</h3>
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="text-gray-600">SCAN ID:</div>
                <div className="text-white text-right">{results?.scan_id || '---'}</div>
                <div className="text-gray-600">TIMESTAMP:</div>
                <div className="text-white text-right">{results ? new Date(results.timestamp).toLocaleTimeString() : '---'}</div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-2">Detected Objects (YOLOv8n)</div>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {results?.detections && results.detections.length > 0 ? results.detections.map((det, i) => (
                    <div key={i} className={`flex justify-between items-center p-2 rounded border ${
                      det.threat_level === 'CRITICAL' ? 'bg-accent-red/10 border-accent-red/30 text-accent-red' :
                      det.threat_level === 'HIGH' ? 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber' :
                      'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px]">{det.label}</span>
                      </div>
                      <span className="text-[9px] font-mono">{(det.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )) : (
                    <div className="text-[10px] font-mono text-gray-700 italic py-2">
                      {results ? 'Zero threat signatures detected' : 'Waiting for scan data...'}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="text-[10px] font-mono text-gray-600 uppercase mb-2">Aggregate Risk</div>
                <div className={`text-center py-2 rounded text-sm font-bold font-mono border ${
                  results?.risk_level === 'CRITICAL' ? 'bg-accent-red text-black border-accent-red' :
                  results?.risk_level === 'HIGH' || results?.risk_level === 'SUSPICIOUS' ? 'bg-accent-amber text-black border-accent-amber' :
                  results ? 'bg-accent-green/20 text-accent-green border-accent-green/30' : 'bg-gray-900 text-gray-700 border-gray-800'
                }`}>
                  {results?.risk_level || 'WAITING'}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/60 border border-gray-800 rounded relative overflow-hidden">
              <div className="text-[9px] font-mono text-gray-500 mb-1">NEXUS AI ASSESSMENT</div>
              <div className={`text-[10px] font-mono leading-tight ${results?.risk_level === 'CRITICAL' ? 'text-accent-red' : 'text-gray-400'}`}>
                {results?.nexus_assessment || "Initialize scan to generate AI intelligence assessment."}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 bg-accent-red text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accent-red/80 transition-all">Flag</button>
              <button className="flex-1 py-2 bg-accent-green/20 text-accent-green border border-accent-green/50 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accent-green/30 transition-all">Clear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-4 gap-4 pb-4">
        {[
          { label: 'System Scans', value: stats.totalScans },
          { label: 'Threats Flagged', value: stats.threatsDetected },
          { label: 'Cleared Bags', value: stats.clearBags },
          { label: 'Inference Time', value: results ? '1.5s' : '---' }
        ].map((stat, i) => (
          <div key={i} className="bg-black/40 border border-gray-800 p-3 rounded-lg flex flex-col items-center">
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">{stat.label}</span>
            <span className="text-xl font-bold font-mono text-white">{stat.value}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scan-line-full {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </main>
  );
};

export default XRayScanner;
