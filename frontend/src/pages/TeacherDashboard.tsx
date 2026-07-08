import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LogOut, ChevronRight, CheckCircle, XCircle, Menu, Signal, Wifi, Battery } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [showRoster, setShowRoster] = useState(false);

  const token = localStorage.getItem('auth_token');
  const fetchConfig = {
    headers: { 'Authorization': `Bearer ${token}` }
  };

  const { data: deps } = useQuery({ queryKey: ['deps'], queryFn: () => fetch('http://localhost:8081/api/departments', fetchConfig).then(res => res.json()) });
  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: () => fetch('http://localhost:8081/api/classes', fetchConfig).then(res => res.json()) });
  const { data: subs } = useQuery({ queryKey: ['subs'], queryFn: () => fetch('http://localhost:8081/api/subjects', fetchConfig).then(res => res.json()) });

  const availableSemesters = Array.from(new Set(classes?.filter((c: any) => c.department.id.toString() === department).map((c: any) => c.semester))) as number[];
  const availableSections = Array.from(new Set(classes?.filter((c: any) => c.department.id.toString() === department && c.semester.toString() === semester).map((c: any) => c.section))) as string[];
  const availableSubjects = subs?.filter((s: any) => s.department.id.toString() === department) || [];

  const handleFetchStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !semester || !section || !subject) {
      alert("Please select all fields");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/students?departmentId=${department}&semester=${semester}&section=${section}`, fetchConfig);
      const data = await res.json();
      
      const studentsWithStatus = data.map((s: any) => ({
        id: s.id,
        name: s.user?.name || 'Unknown',
        roll: s.rollNumber,
        status: null
      }));
      
      setStudents(studentsWithStatus);
      setShowRoster(true);
    } catch (err) {
      alert("Failed to load roster");
    }
  };

  const markStudent = (id: number, status: 'present' | 'absent') => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const classId = classes?.find((c: any) => 
        c.department.id.toString() === department && 
        c.semester.toString() === semester && 
        c.section === section
      )?.id;

      const payload = {
        teacherId: 1, 
        classId: classId,
        subjectId: parseInt(subject),
        date: new Date().toISOString().split('T')[0],
        timeSlot: 'Morning',
        attendanceRecord: students.map(s => ({
          studentId: s.id,
          status: s.status
        }))
      };

      const res = await fetch('http://localhost:8081/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      alert("Attendance Saved Successfully!");
      setShowRoster(false);
      setStudents([]);
    }
  });

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[400px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden h-[800px] max-h-screen flex flex-col relative border-[8px] border-white ring-1 ring-gray-200">
        
        {/* Fake Mobile Status Bar & Notch */}
        <div className="bg-[#0A192F] h-12 w-full flex justify-between items-center px-6 text-white text-[10px] font-bold shrink-0">
          <Menu className="w-4 h-4 cursor-pointer" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white rounded-b-3xl"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Teacher</span>
            <button onClick={() => { localStorage.removeItem('auth_token'); navigate('/login'); }} className="text-white hover:text-red-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-10 flex flex-col bg-[#F8FAFC]">
          
          <div className="bg-[#0A192F] px-6 pt-4 pb-12 rounded-b-[40px] shadow-lg shrink-0">
            <h1 className="text-2xl font-bold text-white tracking-tight">Mark Attendance</h1>
            <p className="text-blue-200 text-xs mt-1">Select class parameters to fetch roster</p>
          </div>

          <div className="px-6 -mt-8 relative z-10 flex flex-col gap-6">
            
            {/* Form Card */}
            {!showRoster && (
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <form onSubmit={handleFetchStudents} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all appearance-none cursor-pointer">
                      <option value="">-- Select --</option>
                      {deps?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Semester</label>
                    <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!department} className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all appearance-none cursor-pointer disabled:opacity-50">
                      <option value="">-- Select --</option>
                      {availableSemesters.map((s: number) => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Section</label>
                    <select value={section} onChange={e => setSection(e.target.value)} disabled={!semester} className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all appearance-none cursor-pointer disabled:opacity-50">
                      <option value="">-- Select --</option>
                      {availableSections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Subject</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!department} className="w-full bg-[#F8FAFC] border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all appearance-none cursor-pointer disabled:opacity-50">
                      <option value="">-- Select --</option>
                      {availableSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full bg-[#0077B6] text-white font-semibold rounded-full py-4 shadow-[0_8px_20px_rgba(0,119,182,0.3)] hover:bg-[#005f92] transition-colors">
                      Fetch Roster
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Roster Card */}
            {showRoster && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-[500px]">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                  <h2 className="font-bold text-[#0A192F] text-sm">Student Roster</h2>
                  <button onClick={() => setShowRoster(false)} className="text-[10px] font-bold text-[#0077B6] uppercase tracking-wider">
                    Change Class
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                  {students.map((student) => (
                    <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#0A192F]">{student.name}</div>
                        <div className="text-[10px] text-gray-400 font-semibold">{student.roll}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => markStudent(student.id, 'present')}
                          className={`p-2 rounded-full transition-all ${student.status === 'present' ? 'bg-green-100 text-green-600 ring-2 ring-green-600' : 'bg-gray-100 text-gray-400 hover:bg-green-50'}`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => markStudent(student.id, 'absent')}
                          className={`p-2 rounded-full transition-all ${student.status === 'absent' ? 'bg-red-100 text-red-600 ring-2 ring-red-600' : 'bg-gray-100 text-gray-400 hover:bg-red-50'}`}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="text-center p-10 text-gray-400 text-sm font-semibold">No students found.</div>
                  )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                  <button 
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending || students.some(s => s.status === null)}
                    className="w-full bg-[#0077B6] text-white font-semibold rounded-full py-3 shadow-[0_8px_20px_rgba(0,119,182,0.3)] hover:bg-[#005f92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitMutation.isPending ? 'Saving...' : 'Save Attendance'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
