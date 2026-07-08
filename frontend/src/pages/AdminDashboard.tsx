import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, GraduationCap, Building2, AlertTriangle, Plus, Trash2, LogOut, Menu, Signal, Wifi, Battery } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments'>('overview');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[400px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden h-[800px] max-h-screen flex flex-col relative border-[8px] border-white ring-1 ring-gray-200">
        
        {/* Fake Mobile Status Bar & Notch */}
        <div className="bg-[#0A192F] h-12 w-full flex justify-between items-center px-6 text-white text-[10px] font-bold shrink-0">
          <Menu className="w-4 h-4 cursor-pointer" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white rounded-b-3xl"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Admin</span>
            <button onClick={() => { localStorage.removeItem('auth_token'); navigate('/login'); }} className="text-white hover:text-red-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deep Navy Header Extension */}
        <div className="bg-[#0A192F] px-6 pt-4 pb-12 rounded-b-[40px] shadow-lg shrink-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Center</h1>
          <p className="text-blue-200 text-xs mt-1">System Overview & Data</p>
        </div>

        <div className="px-6 -mt-6 relative z-10 flex flex-col h-full overflow-hidden pb-4">
          
          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-full p-1 shadow-sm mb-6 shrink-0">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'overview' ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('departments')} 
              className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'departments' ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Departments
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-6 space-y-4 pr-1">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <div className="p-3 bg-blue-50 rounded-full mb-3"><GraduationCap className="w-6 h-6 text-[#0077B6]" /></div>
                  <div className="text-2xl font-bold text-[#0A192F]">{stats?.totalStudents || 0}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 text-center">Students</div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <div className="p-3 bg-purple-50 rounded-full mb-3"><Users className="w-6 h-6 text-purple-500" /></div>
                  <div className="text-2xl font-bold text-[#0A192F]">{stats?.totalTeachers || 0}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 text-center">Trainers</div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <div className="p-3 bg-green-50 rounded-full mb-3"><Building2 className="w-6 h-6 text-green-500" /></div>
                  <div className="text-2xl font-bold text-[#0A192F]">{stats?.todaysAttendancePercentage || 0}%</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 text-center">Attendance</div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <div className="p-3 bg-yellow-50 rounded-full mb-3"><AlertTriangle className="w-6 h-6 text-yellow-500" /></div>
                  <div className="text-2xl font-bold text-[#0A192F]">{stats?.pendingLeaves || 0}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 text-center">Pending Leaves</div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                
                {/* Add New Dept Form */}
                <div className="bg-gradient-to-br from-[#00A6DA] to-[#0077B6] rounded-3xl p-5 text-white shadow-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Department
                  </h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      createDeptMutation.mutate({ name: newDeptName, code: newDeptCode });
                    }} 
                    className="space-y-3"
                  >
                    <input 
                      type="text" 
                      value={newDeptCode}
                      onChange={e => setNewDeptCode(e.target.value)}
                      placeholder="Code (e.g. CS)" 
                      className="w-full bg-white/20 border-none rounded-full px-4 py-2 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                      required 
                    />
                    <input 
                      type="text" 
                      value={newDeptName}
                      onChange={e => setNewDeptName(e.target.value)}
                      placeholder="Name (e.g. Computer Science)" 
                      className="w-full bg-white/20 border-none rounded-full px-4 py-2 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                      required 
                    />
                    <button 
                      type="submit" 
                      disabled={createDeptMutation.isPending}
                      className="w-full bg-white text-[#0077B6] font-bold rounded-full py-2 hover:bg-blue-50 transition-colors mt-2"
                    >
                      {createDeptMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </form>
                </div>

                {/* Dept List */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-2">Existing Departments</h3>
                  {departments?.map((dept: any) => (
                    <div key={dept.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-[#0A192F]">{dept.code}</div>
                        <div className="text-xs text-gray-500">{dept.name}</div>
                      </div>
                      <button 
                        onClick={() => deleteDeptMutation.mutate(dept.id)}
                        className="p-2 text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {departments?.length === 0 && (
                    <div className="text-center p-8 text-gray-400 text-xs font-semibold">No Departments Found</div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
