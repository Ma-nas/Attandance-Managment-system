import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LogOut, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

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

  // Fetch Metadata
  const { data: deps } = useQuery({ queryKey: ['deps'], queryFn: () => fetch('http://localhost:8081/api/departments', fetchConfig).then(res => res.json()) });
  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: () => fetch('http://localhost:8081/api/classes', fetchConfig).then(res => res.json()) });
  const { data: subs } = useQuery({ queryKey: ['subs'], queryFn: () => fetch('http://localhost:8081/api/subjects', fetchConfig).then(res => res.json()) });

  // Filter available options based on selections
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
        teacherId: 1, // Mocked for now
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
    <div className="min-h-screen bg-blobs bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-50 min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Navy Header */}
        <div className="navy-header p-6 pb-12 flex justify-between items-center rounded-b-[40px] relative z-10">
          <div className="text-white font-semibold text-lg">Mark Attendance</div>
          <button onClick={() => { localStorage.removeItem('auth_token'); navigate('/login'); }} className="text-white hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 -mt-6 z-20 pb-8 flex flex-col space-y-6">
          
          {/* Form Card */}
          {!showRoster && (
            <div className="modern-card p-6 md:p-8 relative overflow-hidden bg-white">
              <h2 className="text-lg font-bold text-[var(--primary-navy)] mb-6 flex items-center">
                Select Class <ChevronRight className="w-5 h-5 text-gray-400 ml-1" />
              </h2>
              
              <form onSubmit={handleFetchStudents} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Department</label>
                  <select value={department} onChange={e => setDepartment(e.target.value)} className="modern-select">
                    <option value="">-- SELECT --</option>
                    {deps?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Semester</label>
                  <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!department} className="modern-select disabled:opacity-50">
                    <option value="">-- SELECT --</option>
                    {availableSemesters.map((s: number) => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Section</label>
                  <select value={section} onChange={e => setSection(e.target.value)} disabled={!semester} className="modern-select disabled:opacity-50">
                    <option value="">-- SELECT --</option>
                    {availableSections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!department} className="modern-select disabled:opacity-50">
                    <option value="">-- SELECT --</option>
                    {availableSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>

                <div className="pt-4">
                  <button type="submit" className="modern-button w-full">Fetch Student Roster</button>
                </div>
              </form>
            </div>
          )}

          {/* Roster Card */}
          {showRoster && (
            <div className="modern-card overflow-hidden bg-white flex flex-col h-[600px]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="font-bold text-[var(--primary-navy)] text-lg">Student Roster</h2>
                  <p className="text-xs text-gray-500 mt-1">Mark everyone carefully</p>
                </div>
                <button onClick={() => setShowRoster(false)} className="text-xs font-semibold text-[var(--primary-blue)] px-3 py-1 bg-blue-50 rounded-full">
                  Change Class
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                {students.map((student) => (
                  <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[var(--primary-navy)]">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.roll}</div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markStudent(student.id, 'present')}
                        className={`p-2 rounded-full transition-all ${student.status === 'present' ? 'bg-green-100 text-green-600 ring-2 ring-green-600' : 'bg-gray-100 text-gray-400 hover:bg-green-50'}`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => markStudent(student.id, 'absent')}
                        className={`p-2 rounded-full transition-all ${student.status === 'absent' ? 'bg-red-100 text-red-600 ring-2 ring-red-600' : 'bg-gray-100 text-gray-400 hover:bg-red-50'}`}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <div className="text-center p-10 text-gray-400">No students found for this class.</div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-gray-100">
                <button 
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending || students.some(s => s.status === null)}
                  className="modern-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
