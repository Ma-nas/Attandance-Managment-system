import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('auth_role');

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to their respective dashboard if they try to access something they shouldn't
    if (role === 'STUDENT') return <Navigate to="/" replace />;
    if (role === 'TEACHER') return <Navigate to="/teacher" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Global catch-all redirect
function RootRedirect() {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('auth_role');

  if (!token || !role) return <Navigate to="/login" replace />;
  if (role === 'STUDENT') return <Navigate to="/" replace />;
  if (role === 'TEACHER') return <Navigate to="/teacher" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Catch-all route to handle unauthorized or unknown paths */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
