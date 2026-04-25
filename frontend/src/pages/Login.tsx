import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/60 border border-gray-800 rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-red"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-accent-red rounded flex items-center justify-center font-bold text-black italic">A</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">AEGIS-AERO</h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-balance">Intelligence Security Operating Center</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs font-mono rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded p-3 text-sm font-mono text-white focus:border-accent-red outline-none transition-colors"
              placeholder="Enter credentials..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded p-3 text-sm font-mono text-white focus:border-accent-red outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-red text-black font-bold text-xs uppercase tracking-[0.2em] rounded hover:bg-accent-red/90 transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? 'Authenticating...' : 'Establish Secure Link'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">
            Authorized Personnel Only. All actions are logged and monitored by NEXUS AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
