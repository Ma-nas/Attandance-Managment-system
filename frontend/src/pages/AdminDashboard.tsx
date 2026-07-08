import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, GraduationCap, Building2, AlertTriangle, Activity, Plus, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments'>('overview');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-blobs bg-slate-50">
      {/* Navy Header */}
      <div className="navy-header p-8 pb-16 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-[var(--accent-blue)]" /> Admin Center
          </h1>
          <p className="text-blue-200 text-sm mt-1">System Overview & Master Data</p>
        </div>
        <button onClick={() => { localStorage.removeItem('auth_token'); navigate('/login'); }} className="text-white hover:text-red-300 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 z-20 relative space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('departments')} 
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${activeTab === 'departments' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Departments
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="modern-card p-6 border-l-4 border-[var(--primary-blue)]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Total Students</h3>
                <div className="p-2 bg-blue-50 rounded-full"><GraduationCap className="w-5 h-5 text-[var(--primary-blue)]" /></div>
              </div>
              <div className="text-4xl font-bold text-[var(--primary-navy)]">{stats?.totalStudents || 0}</div>
            </div>

            <div className="modern-card p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Active Trainers</h3>
                <div className="p-2 bg-purple-50 rounded-full"><Users className="w-5 h-5 text-purple-500" /></div>
              </div>
              <div className="text-4xl font-bold text-[var(--primary-navy)]">{stats?.totalTeachers || 0}</div>
            </div>

            <div className="modern-card p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Today's Attendance</h3>
                <div className="p-2 bg-green-50 rounded-full"><Building2 className="w-5 h-5 text-green-500" /></div>
              </div>
              <div className="text-4xl font-bold text-[var(--primary-navy)]">{stats?.todaysAttendancePercentage || 0}%</div>
            </div>

            <div className="modern-card p-6 border-l-4 border-yellow-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase">Pending Leaves</h3>
                <div className="p-2 bg-yellow-50 rounded-full"><AlertTriangle className="w-5 h-5 text-yellow-500" /></div>
              </div>
              <div className="text-4xl font-bold text-[var(--primary-navy)]">{stats?.pendingLeaves || 0}</div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 modern-card overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-[var(--primary-navy)] text-lg">Departments Directory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 bg-white">
                      <th className="p-4">ID</th>
                      <th className="p-4">Code</th>
                      <th className="p-4">Name</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {departments?.map((dept: any) => (
                      <tr key={dept.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-500">{dept.id}</td>
                        <td className="p-4 font-bold text-[var(--primary-navy)]">{dept.code}</td>
                        <td className="p-4">{dept.name}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => deleteDeptMutation.mutate(dept.id)}
                            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {departments?.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                          No Departments Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modern-card p-6 bg-white h-fit">
              <h2 className="text-lg font-bold text-[var(--primary-navy)] mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[var(--primary-blue)]" /> Add New
              </h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  createDeptMutation.mutate({ name: newDeptName, code: newDeptCode });
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-4">Dept Code</label>
                  <input 
                    type="text" 
                    value={newDeptCode}
                    onChange={e => setNewDeptCode(e.target.value)}
                    placeholder="e.g. CS" 
                    className="modern-input"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-4">Dept Name</label>
                  <input 
                    type="text" 
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                    placeholder="e.g. Computer Science" 
                    className="modern-input"
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={createDeptMutation.isPending}
                  className="modern-button w-full mt-4"
                >
                  {createDeptMutation.isPending ? 'Saving...' : 'Save Department'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
