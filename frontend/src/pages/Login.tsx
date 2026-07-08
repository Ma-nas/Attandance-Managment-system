import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';

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
      localStorage.setItem('auth_role', data.role);
      
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
    <div className="min-h-screen bg-[#F3F7FA] flex items-center justify-center p-4 sm:p-8">
      
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side: Branding / Graphic (Visible on Desktop) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00A6DA] to-[#0077B6] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Smart Attendance.</h2>
            <p className="text-blue-100 text-lg">Streamline your academic tracking with our modern, cloud-based platform.</p>
          </div>
          
          {/* Decorative Circles matching the UI aesthetic */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 border-[40px] border-white/10 rounded-full z-0"></div>
          <div className="absolute top-12 -right-12 w-32 h-32 bg-white/10 rounded-full z-0"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 px-8 py-16 md:p-16 flex flex-col justify-center bg-white relative">
          
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-[#0A192F] mb-2 tracking-tight">Let's Get You Started</h1>
            <p className="text-gray-400 text-sm">Tell us something about yourself to login</p>
          </div>

          {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-4 rounded-2xl font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-20">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Register No. / Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all placeholder-gray-400"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all placeholder-gray-400 pr-12"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-gray-400 hover:text-[#0077B6] transition-colors font-semibold">Forgot Password?</a>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="w-full bg-[#0077B6] text-white font-bold rounded-full py-4 text-lg shadow-[0_8px_20px_rgba(0,119,182,0.3)] hover:bg-[#005f92] hover:shadow-[0_10px_25px_rgba(0,119,182,0.4)] transition-all transform hover:-translate-y-1"
              >
                {loginMutation.isPending ? 'Logging in...' : "I'm Done"}
              </button>
            </div>
          </form>
          
          {/* Mobile bottom decoration (Hidden on desktop) */}
          <div className="md:hidden absolute -bottom-16 -left-16 w-48 h-48 bg-blue-50/80 rounded-full z-0 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
