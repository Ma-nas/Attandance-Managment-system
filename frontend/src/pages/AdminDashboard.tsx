import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, GraduationCap, Building2, AlertTriangle, Plus, Trash2, LogOut, Menu, CalendarCheck, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'students' | 'trainers' | 'attendance'>('overview');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  
  // Attendance Review State
  const [reviewClassId, setReviewClassId] = useState('');
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('auth_token');
  const fetchConfig = { headers: { 'Authorization': `Bearer ${token}` } };

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => fetch('http://localhost:8081/api/admin/stats', fetchConfig).then(res => res.json())
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetch('http://localhost:8081/api/departments', fetchConfig).then(res => res.json())
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch('http://localhost:8081/api/admin/students', fetchConfig).then(res => res.json()),
    enabled: activeTab === 'students'
  });

  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => fetch('http://localhost:8081/api/admin/teachers', fetchConfig).then(res => res.json()),
    enabled: activeTab === 'trainers'
  });

  const { data: attendanceRecords, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendanceReview', reviewClassId, reviewDate],
    queryFn: () => fetch(`http://localhost:8081/api/attendance/review?classId=${reviewClassId}&date=${reviewDate}`, fetchConfig).then(res => res.json()),
    enabled: activeTab === 'attendance' && !!reviewClassId && !!reviewDate
  });

  const createDeptMutation = useMutation({
    mutationFn: (newDept: any) => fetch('http://localhost:8081/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newDept)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setNewDeptName('');
      setNewDeptCode('');
    }
  });

  const deleteDeptMutation = useMutation({
    mutationFn: (id: number) => fetch(`http://localhost:8081/api/departments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    }
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => fetch(`http://localhost:8081/api/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceReview'] });
    }
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => fetch('http://localhost:8081/api/classes', fetchConfig).then(res => res.json()),
    enabled: activeTab === 'attendance'
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F3F7FA] flex flex-col">
      {/* Responsive Header */}
      <div className="bg-[#0A192F] w-full px-6 md:px-12 py-6 flex justify-between items-center text-white shadow-lg shrink-0 rounded-b-[30px] md:rounded-b-[40px] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer hover:text-blue-300 transition-colors" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden sm:block">Admin Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base font-semibold">Super Admin</span>
          <button onClick={handleLogout} className="text-white hover:text-red-300 transition-colors ml-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-full p-2 shadow-sm shrink-0 w-full overflow-x-auto custom-scrollbar">
          <div className="flex min-w-max">
            {['overview', 'departments', 'students', 'trainers', 'attendance'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`px-6 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="p-4 bg-blue-50 rounded-full mb-4"><GraduationCap className="w-8 h-8 text-[#0077B6]" /></div>
              <div className="text-4xl font-bold text-[#0A192F]">{stats?.totalStudents || 0}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2 text-center">Total Students</div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="p-4 bg-purple-50 rounded-full mb-4"><Users className="w-8 h-8 text-purple-500" /></div>
              <div className="text-4xl font-bold text-[#0A192F]">{stats?.totalTeachers || 0}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2 text-center">Active Trainers</div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="p-4 bg-green-50 rounded-full mb-4"><Building2 className="w-8 h-8 text-green-500" /></div>
              <div className="text-4xl font-bold text-[#0A192F]">{stats?.todaysAttendancePercentage || 0}%</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2 text-center">Today's Attendance</div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="p-4 bg-yellow-50 rounded-full mb-4"><AlertTriangle className="w-8 h-8 text-yellow-500" /></div>
              <div className="text-4xl font-bold text-[#0A192F]">{stats?.pendingLeaves || 0}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2 text-center">Pending Leaves</div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-[#0A192F] text-xl">Departments Directory</h2>
                </div>
                <div className="p-6 space-y-4 bg-[#F8FAFC]">
                  {departments?.map((dept: any) => (
                    <div key={dept.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-[#0A192F]">{dept.name}</div>
                        <div className="text-sm text-gray-400 font-semibold mt-1">Code: {dept.code}</div>
                      </div>
                      <button onClick={() => deleteDeptMutation.mutate(dept.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#00A6DA] to-[#0077B6] rounded-[40px] p-8 text-white shadow-lg sticky top-32">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100 mb-8 flex items-center gap-2"><Plus className="w-5 h-5" /> Add Dept</h3>
                <form onSubmit={(e) => { e.preventDefault(); createDeptMutation.mutate({ name: newDeptName, code: newDeptCode }); }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-4">Code</label>
                    <input type="text" value={newDeptCode} onChange={e => setNewDeptCode(e.target.value)} className="w-full bg-white/20 border-none rounded-full px-6 py-4 text-sm text-white placeholder-blue-300 focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase mb-2 ml-4">Name</label>
                    <input type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} className="w-full bg-white/20 border-none rounded-full px-6 py-4 text-sm text-white placeholder-blue-300 focus:outline-none" required />
                  </div>
                  <button type="submit" disabled={createDeptMutation.isPending} className="w-full bg-white text-[#0077B6] font-bold rounded-full py-4 shadow-lg hover:bg-blue-50 transition-colors mt-4">{createDeptMutation.isPending ? 'Saving...' : 'Save'}</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-[#0A192F] text-xl">Student Roster</h2>
                <p className="text-gray-500 text-sm mt-1">Manage all registered students</p>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll No</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dept</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students?.map((s: any) => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-[#0A192F]">{s.rollNumber}</td>
                        <td className="p-4 font-semibold text-gray-700">{s.user?.name}</td>
                        <td className="p-4 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg inline-block my-2 mx-4">{s.department?.code}</td>
                        <td className="p-4 text-gray-500">{s.semester} / {s.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trainers' && (
          <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-[#0A192F] text-xl">Trainer Directory</h2>
              <p className="text-gray-500 text-sm mt-1">Manage all active trainers</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers?.map((t: any) => (
                  <div key={t.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-[#0077B6] flex items-center justify-center text-white font-bold text-xl">{t.user?.name?.charAt(0)}</div>
                      <div>
                        <div className="font-bold text-[#0A192F]">{t.user?.name}</div>
                        <div className="text-xs text-gray-400 font-semibold">{t.user?.email}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">Dept: {t.department?.code}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Select Class</label>
                <select value={reviewClassId} onChange={e => setReviewClassId(e.target.value)} className="w-full bg-slate-100 border-none rounded-full px-6 py-4 text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">-- Choose Class --</option>
                  {classes?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.department?.code} - Sem {c.semester} ({c.section}) [{c.batch}]</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-4">Select Date</label>
                <input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} className="w-full bg-slate-100 border-none rounded-full px-6 py-4 text-sm focus:outline-none" />
              </div>
              <button onClick={() => refetchAttendance()} className="w-full md:w-auto bg-[#0077B6] text-white font-bold rounded-full px-8 py-4 shadow-lg hover:bg-[#00A6DA] transition-colors flex items-center justify-center gap-2">
                <CalendarCheck className="w-5 h-5" /> Load Records
              </button>
            </div>

            {attendanceRecords && (
              <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-[#0A192F] text-xl">Attendance Records</h2>
                  <p className="text-gray-500 text-sm mt-1">{attendanceRecords.length} records found for this date.</p>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record: any) => (
                        <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-semibold text-[#0A192F]">{record.student?.user?.name}</div>
                            <div className="text-xs text-gray-400">{record.student?.rollNumber}</div>
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-700">{record.subject?.name}</td>
                          <td className="p-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => updateAttendanceMutation.mutate({ id: record.id, status: record.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' })}
                              disabled={updateAttendanceMutation.isPending}
                              className="text-xs font-bold text-[#0077B6] bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-end gap-2 ml-auto"
                            >
                              <Edit2 className="w-3 h-3" /> Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {attendanceRecords.length === 0 && <div className="p-8 text-center text-gray-400 font-semibold">No attendance recorded for this filter.</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
