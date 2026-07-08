import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'student' | 'trainer'>('student');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: usn, password: password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Invalid Credentials');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.role);
      
      if (data.role === 'STUDENT') {
        navigate('/');
      } else if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/teacher');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md brutalist-card p-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-4">
            <div className="inline-flex border border-white pl-1.5 pr-4 py-1.5 text-sm sm:text-base font-bold tracking-widest uppercase font-mono h-[48px] sm:h-[52px] items-center gap-3">
              <div className="bg-white rounded-sm flex items-center justify-center h-[36px] sm:h-[40px] px-2.5">
                <span className="text-black font-black text-xl tracking-tighter">AMS</span>
              </div>
              University
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter uppercase font-sans">Training Tracker</h1>
          <p className="mt-2 text-xs font-mono text-muted uppercase">Attendance Today Placement Tomorrow</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-2 border-b border-stark-border pb-4">
          <button 
            type="button" 
            onClick={() => setActiveTab('student')}
            className={`py-2 text-xs font-bold tracking-wider uppercase border transition-all font-mono ${activeTab === 'student' ? 'border-white bg-white text-black' : 'border-stark-border text-muted hover:border-white hover:text-white'}`}
          >
            Student Login
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('trainer')}
            className={`py-2 text-xs font-bold tracking-wider uppercase border transition-all font-mono ${activeTab === 'trainer' ? 'border-white bg-white text-black' : 'border-stark-border text-muted hover:border-white hover:text-white'}`}
          >
            Trainer Login
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs font-mono p-3 uppercase font-bold">{error}</div>}
          
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-widest uppercase text-muted font-mono">
              {activeTab === 'student' ? 'USN' : 'Teacher ID'}
            </label>
            <input 
              type="text" 
              required 
              placeholder={activeTab === 'student' ? 'E.G. 23BTRCN002' : 'E.G. TR1001'}
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="w-full brutalist-input text-sm placeholder:text-zinc-700 uppercase" 
              autoCapitalize="characters" 
              autoCorrect="off" 
              autoComplete="username" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-widest uppercase text-muted font-mono">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full brutalist-input pr-12 text-sm placeholder:text-zinc-700" 
                autoComplete="current-password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full brutalist-button flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'AUTHENTICATING...' : 'LOG IN'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t border-stark-border pt-4 text-center">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Password Issues? Contact Admin</p>
          <a href="mailto:admin@university.ac.in" className="text-[11px] font-mono text-white hover:text-muted transition-colors mt-1 block">admin@university.ac.in</a>
        </div>
      </div>
    </div>
  );
}
