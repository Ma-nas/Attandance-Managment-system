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
    <div className="min-h-screen bg-blobs flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl overflow-hidden min-h-[600px] flex flex-col relative">
        
        {/* Navy Header curve simulation */}
        <div className="navy-header h-32 w-full absolute top-0 left-0 rounded-b-[40px] -z-0"></div>

        <div className="flex-1 px-8 pt-40 pb-10 z-10 flex flex-col">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-[#0A192F] mb-2">Let's Get You Started</h1>
            <p className="text-gray-400 text-sm">Tell us something about yourself</p>
          </div>

          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Register No. / Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="modern-input"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="modern-input pr-12"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-gray-400 hover:text-[var(--primary-blue)] transition-colors">Forgot Password?</a>
            </div>

            <div className="mt-auto pt-8">
              <button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="modern-button w-full text-lg"
              >
                {loginMutation.isPending ? 'Logging in...' : "I'm Done"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Bottom decorative shape */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
      </div>
    </div>
  );
}
