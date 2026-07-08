import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const userName = "Andrew";
  const percentage = 80;
  const attended = 24;
  const total = 30;
  const leavesLeft = 0;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  // SVG Circle calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-blobs bg-[var(--bg-light)] flex flex-col items-center">
      {/* Mobile container constraint to simulate the app look on desktop */}
      <div className="w-full max-w-md bg-[var(--bg-light)] min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Navy Header */}
        <div className="navy-header p-6 pb-8 flex justify-between items-center rounded-b-[30px] relative z-10">
          <button className="text-white hover:text-blue-200 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-white font-semibold text-lg">{userName}</div>
          <button onClick={handleLogout} className="text-white hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pt-10 pb-8 flex flex-col">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--primary-navy)] mb-1">Overall Attendance</h1>
            <p className="text-gray-500 text-sm">Semester 7</p>
          </div>

          {/* Large Circular Progress */}
          <div className="flex justify-center mb-12 relative">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="#EAF2F8"
                strokeWidth="20"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="var(--primary-blue)"
                strokeWidth="20"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-bold text-[var(--primary-navy)] tracking-tighter">{percentage}</span>
              <span className="text-lg font-medium text-[var(--primary-navy)]">percent</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="modern-card p-4 flex flex-col items-center justify-center bg-white">
              <span className="text-2xl font-bold text-[var(--primary-blue)] mb-1">{attended}</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Attended</span>
            </div>
            <div className="modern-card p-4 flex flex-col items-center justify-center bg-[var(--primary-blue)] shadow-[0_8px_20px_rgba(0,119,182,0.3)]">
              <span className="text-2xl font-bold text-white mb-1">{total}</span>
              <span className="text-[10px] text-blue-100 font-semibold uppercase">Total</span>
            </div>
            <div className="modern-card p-4 flex flex-col items-center justify-center bg-white">
              <span className="text-2xl font-bold text-[var(--primary-blue)] mb-1">{leavesLeft}</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Leaves left</span>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="modern-card bg-gradient-to-br from-[var(--accent-blue)] to-[var(--primary-blue)] p-6 text-white relative overflow-hidden mt-auto shadow-[0_10px_25px_rgba(0,119,182,0.4)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-4 flex items-center justify-between">
              Upcoming Events <ChevronRight className="w-4 h-4 opacity-50" />
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold">15</span>
                  <span className="text-[10px] uppercase">Aug</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">75th Independence Day</div>
                  <div className="text-xs text-blue-100">Holiday</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold">20</span>
                  <span className="text-[10px] uppercase">Aug</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">First Onam</div>
                  <div className="text-xs text-blue-100">Holiday</div>
                </div>
              </div>
            </div>
            
            {/* Background decoration in the card */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
