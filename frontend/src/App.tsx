import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';

const queryClient = new QueryClient();

function NeoTopbar() {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  return (
    <header className="border-b border-stark-border bg-black p-4 flex items-center justify-between sticky top-0 z-40">
      <div className="inline-flex border border-white px-3 py-1 text-sm font-bold tracking-widest uppercase font-mono items-center gap-3">
        <div className="bg-white text-black px-2 py-0.5">AMS</div>
        University
      </div>

      <nav className="flex gap-4">
        <Link 
          to="/" 
          className={`py-1 px-4 text-xs font-bold tracking-wider uppercase border transition-all font-mono ${location.pathname === '/' ? 'border-white bg-white text-black' : 'border-stark-border text-muted hover:border-white hover:text-white'}`}
        >
          Student
        </Link>
        <Link 
          to="/teacher" 
          className={`py-1 px-4 text-xs font-bold tracking-wider uppercase border transition-all font-mono ${location.pathname === '/teacher' ? 'border-white bg-white text-black' : 'border-stark-border text-muted hover:border-white hover:text-white'}`}
        >
          Trainer
        </Link>
        <Link 
          to="/admin" 
          className={`py-1 px-4 text-xs font-bold tracking-wider uppercase border transition-all font-mono ${location.pathname === '/admin' ? 'border-white bg-white text-black' : 'border-stark-border text-muted hover:border-white hover:text-white'}`}
        >
          Admin
        </Link>
        <button 
          onClick={() => {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 py-1 px-4 text-xs font-bold tracking-wider uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all font-mono"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-black">
          <NeoTopbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
