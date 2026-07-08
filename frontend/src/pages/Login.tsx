import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Wifi, Battery, Signal } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      
      if (data.role === 'STUDENT') {
        navigate('/');
      } else if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/teacher');
      }
    },
    onError: () => {
      setError("Incorrect Register No. or Password");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[400px] bg-white rounded-[40px] shadow-2xl overflow-hidden h-[800px] max-h-screen flex flex-col relative border-[8px] border-white ring-1 ring-gray-200">
        
        {/* Fake Mobile Status Bar & Notch */}
        <div className="bg-[var(--primary-navy)] h-12 w-full flex justify-between items-center px-6 text-white text-[10px] font-bold rounded-t-[32px] shrink-0">
          <span>10:55</span>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white rounded-b-3xl"></div>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 pt-32 pb-10 z-10 flex flex-col bg-white">
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-[#0A192F] mb-2 tracking-tight">Let's Get You Started</h1>
            <p className="text-gray-400 text-sm">Tell us something about yourself</p>
          </div>

          {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col relative z-20">
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Register No. / Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[var(--primary-blue)] transition-colors placeholder-gray-300"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-[var(--primary-blue)] transition-colors placeholder-gray-300 pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-[10px] text-gray-400 hover:text-[var(--primary-blue)] transition-colors uppercase tracking-wider font-semibold">Forgot Password?</a>
            </div>

            <div className="mt-12">
              <button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="w-4/5 bg-[#0077B6] text-white font-semibold rounded-full py-4 shadow-[0_8px_20px_rgba(0,119,182,0.3)] hover:bg-[#005f92] transition-colors"
              >
                {loginMutation.isPending ? 'Logging in...' : "I'm Done"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Bottom decorative shape matching screenshot */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-50/80 rounded-full z-0 pointer-events-none"></div>
      </div>
    </div>
  );
}
