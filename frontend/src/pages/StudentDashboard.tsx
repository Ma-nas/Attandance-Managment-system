import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronRight, Signal, Wifi, Battery } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[400px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden h-[800px] max-h-screen flex flex-col relative border-[8px] border-white ring-1 ring-gray-200">
        
        {/* Fake Mobile Status Bar & Notch */}
        <div className="bg-[#0A192F] h-12 w-full flex justify-between items-center px-6 text-white text-[10px] font-bold shrink-0">
          <Menu className="w-4 h-4 cursor-pointer" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white rounded-b-3xl"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{userName}</span>
            <button onClick={handleLogout} className="text-white hover:text-red-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deep Navy Header Extension */}
        <div className="bg-[#0A192F] h-6 w-full shrink-0"></div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-10 flex flex-col bg-[#F8FAFC]">
          
          <div className="text-center mt-8 mb-6">
            <h1 className="text-2xl font-bold text-[#0A192F] mb-1 tracking-tight">Overall Attendance</h1>
            <p className="text-gray-500 text-xs font-semibold">Semester 7</p>
          </div>

          {/* Large Circular Progress */}
          <div className="flex justify-center mb-10 relative">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="#0077B6"
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out drop-shadow-md"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-[#0A192F] tracking-tighter">{percentage}</span>
              <span className="text-sm font-bold text-[#0A192F]">percent</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 px-6 mb-8">
            <div className="bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 h-28">
              <span className="text-2xl font-bold text-[#0077B6] mb-2">{attended}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center">Attended</span>
            </div>
            <div className="bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 h-28">
              <span className="text-2xl font-bold text-[#0077B6] mb-2">{total}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center">Total</span>
            </div>
            <div className="bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 h-28">
              <span className="text-2xl font-bold text-[#0077B6] mb-2">{leavesLeft}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center">Leaves left</span>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="px-6 relative">
            {/* Tiny calendar badge floating on left */}
            <div className="absolute -left-3 top-10 bg-white rounded-r-2xl py-3 px-2 shadow-sm border border-l-0 border-gray-100 flex flex-col items-center gap-1 z-10">
              <span className="text-[8px] text-gray-400">▲</span>
              <span className="text-[9px] font-bold text-[#0077B6] -rotate-90 my-2">AUG</span>
              <span className="text-[8px] text-gray-400">▼</span>
            </div>

            <div className="bg-gradient-to-br from-[#00A6DA] to-[#0077B6] rounded-3xl p-5 text-white shadow-[0_10px_25px_rgba(0,119,182,0.3)] relative overflow-hidden pl-10">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                  Upcoming Events
                </h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="text-right shrink-0 min-w-[30px]">
                    <div className="font-bold text-xs">75th</div>
                    <div className="text-[9px] text-blue-200">Aug 15</div>
                  </div>
                  <div className="h-6 w-px bg-white/20"></div>
                  <div>
                    <div className="font-bold text-sm leading-tight">Independence Day</div>
                    <div className="text-[10px] text-blue-100">Holiday</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right shrink-0 min-w-[30px]">
                    <div className="font-bold text-xs">1st</div>
                    <div className="text-[9px] text-blue-200">Aug 20</div>
                  </div>
                  <div className="h-6 w-px bg-white/20"></div>
                  <div>
                    <div className="font-bold text-sm leading-tight">Onam</div>
                    <div className="text-[10px] text-blue-100">Holiday</div>
                  </div>
                </div>
              </div>
              
              {/* Background abstract circles */}
              <div className="absolute -right-8 -top-8 w-32 h-32 border-[20px] border-white/10 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
