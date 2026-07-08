import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, X, Users, Loader2 } from 'lucide-react';

export default function TeacherDashboard() {
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
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      // Find the specific classId based on selection
      const classId = classes?.find((c: any) => 
        c.department.id.toString() === department && 
        c.semester.toString() === semester && 
        c.section === section
      )?.id;

      const payload = {
        teacherId: 1, // Hardcoding to 1 since we don't have user session context decoded yet
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
      alert("Attendance Saved!");
      setShowRoster(false);
      setDepartment('');
      setSemester('');
      setSection('');
      setSubject('');
    }
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 text-white font-mono">
      <div className="brutalist-card p-6 md:p-10 relative overflow-hidden bg-black text-white">
        <h1 className="text-4xl font-black uppercase font-sans tracking-tighter mb-2">Trainer Portal</h1>
        <p className="text-muted font-bold tracking-widest uppercase text-xs">Record Attendance • PRD Workflow</p>
      </div>

      {!showRoster ? (
        <div className="brutalist-card p-8 bg-black">
          <h2 className="text-lg font-black uppercase border-b border-stark-border pb-2 mb-6">Select Class Context</h2>
          <form className="space-y-6" onSubmit={handleFetchStudents}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-muted">Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full brutalist-input appearance-none">
                  <option value="">-- SELECT --</option>
                  {deps?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-muted">Semester</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!department} className="w-full brutalist-input appearance-none disabled:opacity-50">
                  <option value="">-- SELECT --</option>
                  {availableSemesters.map((s: number) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-muted">Section</label>
                <select value={section} onChange={e => setSection(e.target.value)} disabled={!semester} className="w-full brutalist-input appearance-none disabled:opacity-50">
                  <option value="">-- SELECT --</option>
                  {availableSections.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest uppercase text-muted">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!department} className="w-full brutalist-input appearance-none disabled:opacity-50">
                  <option value="">-- SELECT --</option>
                  {availableSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full brutalist-button flex items-center justify-center gap-2 mt-4">
              <Users className="w-5 h-5" /> LOAD STUDENT ROSTER
            </button>
          </form>
        </div>
      ) : (
        <div className="brutalist-card bg-black flex flex-col">
          <div className="p-6 border-b border-stark-border bg-white text-black flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black font-sans uppercase tracking-tight">{subject}</h2>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-600">{department} • {semester} • {section}</p>
            </div>
            <button onClick={() => setShowRoster(false)} className="border border-black px-4 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
              CHANGE CLASS
            </button>
          </div>

          <div className="p-4 border-b border-stark-border flex gap-4 bg-zinc-900">
            <button onClick={() => markAll('present')} className="flex-1 brutalist-button bg-black text-white hover:bg-white hover:text-black text-xs py-3">MARK ALL PRESENT</button>
            <button onClick={() => markAll('absent')} className="flex-1 brutalist-button bg-black text-white hover:bg-white hover:text-black text-xs py-3">MARK ALL ABSENT</button>
          </div>

          <div className="p-6 space-y-4">
            {students.map(student => (
              <div key={student.id} className="border border-stark-border p-4 flex justify-between items-center bg-[#0a0a0a] hover:border-white transition-colors">
                <div>
                  <h4 className="font-bold uppercase">{student.name}</h4>
                  <p className="text-xs text-muted font-bold tracking-widest">{student.roll}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => markStudent(student.id, 'present')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                      student.status === 'present' ? 'bg-white text-black border-white' : 'border-stark-border text-muted hover:border-white hover:text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" /> PRESENT
                  </button>
                  <button 
                    onClick={() => markStudent(student.id, 'absent')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                      student.status === 'absent' ? 'bg-red-500 text-white border-red-500' : 'border-stark-border text-muted hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <X className="w-4 h-4" /> ABSENT
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-stark-border bg-[#0a0a0a]">
            <button 
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending || students.some(s => s.status === null)}
              className="w-full brutalist-button py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'SAVE ATTENDANCE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
