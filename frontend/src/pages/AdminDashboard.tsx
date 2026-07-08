import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, GraduationCap, Building2, AlertTriangle, Plus, Trash2, LogOut, Menu } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F3F7FA] flex flex-col">
      
      {/* Responsive Header */}
      <div className="bg-[#0A192F] w-full px-6 md:px-12 py-6 flex justify-between items-center text-white shadow-lg shrink-0 rounded-b-[30px] md:rounded-b-[40px] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer hover:text-blue-300 transition-colors" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden sm:block">Admin Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base font-semibold">Super Admin</span>
          <button onClick={() => { localStorage.removeItem('auth_token'); navigate('/login'); }} className="text-white hover:text-red-300 transition-colors ml-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-full p-2 shadow-sm shrink-0 w-full md:w-fit self-start">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'overview' ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('departments')} 
            className={`px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'departments' ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Master Data
          </button>
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
            
            {/* Dept List (Spans 2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-bold text-[#0A192F] text-xl">Departments Directory</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage institutional departments</p>
                </div>
                
                <div className="p-6 space-y-4 bg-[#F8FAFC]">
                  {departments?.map((dept: any) => (
                    <div key={dept.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-bold text-lg text-[#0A192F]">{dept.name}</div>
                        <div className="text-sm text-gray-400 font-semibold mt-1">Code: {dept.code}</div>
                      </div>
                      <button 
                        onClick={() => deleteDeptMutation.mutate(dept.id)}
                        className="p-3 text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {departments?.length === 0 && (
                    <div className="text-center p-12 text-gray-400 font-semibold">No Departments Found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Add New Dept Form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#00A6DA] to-[#0077B6] rounded-[40px] p-8 text-white shadow-[0_10px_30px_rgba(0,119,182,0.3)] sticky top-32">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100 mb-8 flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Department
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    createDeptMutation.mutate({ name: newDeptName, code: newDeptCode });
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 ml-4">Department Code</label>
                    <input 
                      type="text" 
                      value={newDeptCode}
                      onChange={e => setNewDeptCode(e.target.value)}
                      placeholder="e.g. CS" 
                      className="w-full bg-white/20 border-none rounded-full px-6 py-4 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 ml-4">Department Name</label>
                    <input 
                      type="text" 
                      value={newDeptName}
                      onChange={e => setNewDeptName(e.target.value)}
                      placeholder="e.g. Computer Science" 
                      className="w-full bg-white/20 border-none rounded-full px-6 py-4 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={createDeptMutation.isPending}
                    className="w-full bg-white text-[#0077B6] font-bold rounded-full py-4 shadow-lg hover:bg-blue-50 transition-colors mt-4 text-lg"
                  >
                    {createDeptMutation.isPending ? 'Saving...' : 'Save Department'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
