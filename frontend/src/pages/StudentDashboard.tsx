import { BookOpen, AlertTriangle } from 'lucide-react';

export default function StudentDashboard() {
  const attendancePercentage = 88;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 text-white font-mono">
      {/* Header */}
      <div className="brutalist-card p-6 md:p-10 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase font-sans tracking-tighter mb-2">
              ALEX MORGAN
            </h1>
            <p className="text-muted font-bold tracking-widest uppercase text-xs">USN: 23BTRCL210 • B.Tech CS, SEM 4</p>
          </div>
          <div className="border border-white p-4 text-center bg-black">
            <div className="text-[10px] text-muted tracking-widest uppercase mb-1">Overall Attendance</div>
            <div className="text-4xl font-black font-sans">{attendancePercentage}%</div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Alerts / Info */}
        <div className="brutalist-card p-8 flex flex-col gap-4">
          <h2 className="text-lg font-black uppercase border-b border-stark-border pb-2">Status Alerts</h2>
          <div className="border border-yellow-500 bg-yellow-500/10 p-4 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-500 uppercase text-sm mb-1">Low Attendance Warning</h3>
              <p className="text-xs text-muted">Your attendance in Computer Architecture has dropped below 80%. Please attend upcoming classes to maintain eligibility.</p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="brutalist-card p-8">
          <h2 className="text-lg font-black uppercase border-b border-stark-border pb-2 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Subject Breakdown
          </h2>
          
          <div className="space-y-4">
            {[
              { name: 'Advanced Mathematics', val: 92, code: 'MAT401' },
              { name: 'Computer Architecture', val: 78, code: 'CS402' },
              { name: 'Data Structures', val: 88, code: 'CS403' },
              { name: 'Operating Systems', val: 95, code: 'CS404' },
            ].map((subject, idx) => (
              <div key={idx} className="border border-stark-border p-4 hover:border-white transition-colors bg-black">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-sm uppercase">{subject.name}</h3>
                    <span className="text-[10px] text-muted tracking-widest">{subject.code}</span>
                  </div>
                  <span className={`font-black font-sans text-xl ${subject.val < 80 ? 'text-yellow-500' : 'text-white'}`}>{subject.val}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-stark-border h-2 overflow-hidden">
                  <div 
                    style={{ width: `${subject.val}%` }} 
                    className={`h-full ${subject.val < 80 ? 'bg-yellow-500' : 'bg-white'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
