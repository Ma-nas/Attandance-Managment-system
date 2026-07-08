import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, GraduationCap, Building2, AlertTriangle, Activity, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'subjects' | 'classes'>('overview');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  
  const token = localStorage.getItem('auth_token');
  const queryClient = useQueryClient();

  const fetchConfig = {
    headers: { 'Authorization': `Bearer ${token}` }
  };

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => fetch('http://localhost:8081/api/admin/stats', fetchConfig).then(res => res.json())
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetch('http://localhost:8081/api/departments', fetchConfig).then(res => res.json())
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-white font-mono">
      <div className="brutalist-card p-6 md:p-10 relative overflow-hidden bg-black flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase font-sans tracking-tighter mb-2 flex items-center gap-4">
            <Activity className="w-8 h-8" /> SYSTEM OVERVIEW
          </h1>
          <p className="text-muted font-bold tracking-widest uppercase text-xs">Admin Control Center • Master Data Management</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-xs font-bold uppercase border ${activeTab === 'overview' ? 'bg-white text-black border-white' : 'border-stark-border hover:border-white'}`}>Overview</button>
          <button onClick={() => setActiveTab('departments')} className={`px-4 py-2 text-xs font-bold uppercase border ${activeTab === 'departments' ? 'bg-white text-black border-white' : 'border-stark-border hover:border-white'}`}>Departments</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="brutalist-card p-6 border-blue-500 hover:bg-blue-500/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-blue-500">Total Students</h3>
                <GraduationCap className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-5xl font-black font-sans">{stats?.totalStudents || 0}</div>
            </div>

            <div className="brutalist-card p-6 border-purple-500 hover:bg-purple-500/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-purple-500">Active Trainers</h3>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-5xl font-black font-sans">{stats?.totalTeachers || 0}</div>
            </div>

            <div className="brutalist-card p-6 border-green-500 hover:bg-green-500/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-green-500">Today's Attendance</h3>
                <Building2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-5xl font-black font-sans">{stats?.todaysAttendancePercentage || 0}%</div>
            </div>

            <div className="brutalist-card p-6 border-yellow-500 hover:bg-yellow-500/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-yellow-500">Pending Leaves</h3>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-5xl font-black font-sans">{stats?.pendingLeaves || 0}</div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 brutalist-card bg-black p-0 overflow-hidden">
            <div className="p-4 border-b border-stark-border bg-white text-black font-black uppercase text-xl">
              DEPARTMENTS LIST
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stark-border bg-zinc-900 text-xs font-bold tracking-widest uppercase text-muted">
                    <th className="p-4">ID</th>
                    <th className="p-4">CODE</th>
                    <th className="p-4">NAME</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {departments?.map((dept: any) => (
                    <tr key={dept.id} className="border-b border-stark-border hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-bold">{dept.id}</td>
                      <td className="p-4 text-xs font-bold tracking-widest">{dept.code}</td>
                      <td className="p-4 uppercase font-bold">{dept.name}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => deleteDeptMutation.mutate(dept.id)}
                          className="border border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-black transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {departments?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted text-sm font-bold uppercase tracking-widest">
                        No Departments Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="brutalist-card p-6 bg-black h-fit">
            <h2 className="text-lg font-black uppercase border-b border-stark-border pb-2 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> ADD NEW
            </h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                createDeptMutation.mutate({ name: newDeptName, code: newDeptCode });
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-muted mb-1">DEPT CODE</label>
                <input 
                  type="text" 
                  value={newDeptCode}
                  onChange={e => setNewDeptCode(e.target.value)}
                  placeholder="e.g. CS" 
                  className="w-full brutalist-input text-sm"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-muted mb-1">DEPT NAME</label>
                <input 
                  type="text" 
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  placeholder="e.g. Computer Science" 
                  className="w-full brutalist-input text-sm"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={createDeptMutation.isPending}
                className="w-full brutalist-button text-xs py-3 mt-4 disabled:opacity-50"
              >
                {createDeptMutation.isPending ? 'SAVING...' : 'SAVE DEPARTMENT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
