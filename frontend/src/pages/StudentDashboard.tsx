import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const userName = "Andrew Sam";
  const percentage = 80;
  const attended = 24;
  const total = 30;
  const leavesLeft = 0;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const radius = window.innerWidth < 768 ? 80 : 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#F3F7FA] flex flex-col">
      
      {/* Responsive Header */}
      <div className="bg-[#0A192F] w-full px-6 md:px-12 py-6 flex justify-between items-center text-white shadow-lg shrink-0 rounded-b-[30px] md:rounded-b-[40px] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer hover:text-blue-300 transition-colors" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden sm:block">SAMS Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base font-semibold">{userName}</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            {userName.charAt(0)}
          </div>
          <button onClick={handleLogout} className="text-white hover:text-red-300 transition-colors ml-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column: Attendance Overview */}
          <div className="w-full md:w-2/3 bg-white rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center">
            
            <div className="text-center mb-10 w-full flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#0A192F] tracking-tight">Overall Attendance</h2>
                <p className="text-gray-500 text-sm font-semibold mt-1">Semester 7</p>
              </div>
              <button className="mt-4 md:mt-0 text-sm font-bold text-[#0077B6] bg-blue-50 px-6 py-2 rounded-full hover:bg-blue-100 transition-colors">
                View Details
              </button>
            </div>

            {/* Large Circular Progress */}
            <div className="flex justify-center mb-12 relative w-full">
              <svg className="w-56 h-56 md:w-80 md:h-80 transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="#E5E7EB" strokeWidth={window.innerWidth < 768 ? "16" : "24"} fill="none" />
                <circle
                  cx="50%" cy="50%" r={radius} stroke="#0077B6" strokeWidth={window.innerWidth < 768 ? "16" : "24"} fill="none"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl md:text-8xl font-black text-[#0A192F] tracking-tighter">{percentage}</span>
                <span className="text-sm md:text-xl font-bold text-[#0A192F]">percent</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 w-full">
              <div className="bg-[#F8FAFC] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-2">{attended}</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Attended</span>
              </div>
              <div className="bg-[#0077B6] rounded-3xl p-6 flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(0,119,182,0.3)] transform md:-translate-y-4">
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">{total}</span>
                <span className="text-[10px] md:text-xs text-blue-100 font-bold uppercase tracking-wider text-center">Total</span>
              </div>
              <div className="bg-[#F8FAFC] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-2">{leavesLeft}</span>
                <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Leaves left</span>
              </div>
            </div>
          </div>

          {/* Right Column: Events & Actions */}
          <div className="w-full md:w-1/3 flex flex-col gap-8">
            
            <div className="bg-gradient-to-br from-[#00A6DA] to-[#0077B6] rounded-[40px] p-8 text-white shadow-[0_10px_30px_rgba(0,119,182,0.3)] relative overflow-hidden h-full">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100 flex items-center gap-2">
                  Upcoming Events <ChevronRight className="w-4 h-4 opacity-50" />
                </h3>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="text-center shrink-0 w-12">
                    <div className="font-black text-xl">15</div>
                    <div className="text-[10px] uppercase font-bold text-blue-200">Aug</div>
                  </div>
                  <div className="h-10 w-px bg-white/20"></div>
                  <div>
                    <div className="font-bold text-base leading-tight">Independence Day</div>
                    <div className="text-xs text-blue-100 mt-1">National Holiday</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="text-center shrink-0 w-12">
                    <div className="font-black text-xl">20</div>
                    <div className="text-[10px] uppercase font-bold text-blue-200">Aug</div>
                  </div>
                  <div className="h-10 w-px bg-white/20"></div>
                  <div>
                    <div className="font-bold text-base leading-tight">Onam Festival</div>
                    <div className="text-xs text-blue-100 mt-1">Regional Holiday</div>
                  </div>
                </div>
              </div>
              
              {/* Background abstract circles */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
