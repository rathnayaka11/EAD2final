import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import toast from 'react-hot-toast';
import { Users, Mail, Trash2, Search, Filter, ShieldCheck, Activity, UserCheck, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      const doctors = response.data.doctors || [];
      const patients = response.data.patients || [];
      setUsers([...doctors, ...patients]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    try {
      await userApi.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
       console.error(error);
      toast.error('Failed to delete user');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await userApi.updateDoctorStatus(userId, 'ACTIVE');
      toast.success('Doctor approved successfully!');
      fetchUsers(); // List එක Refresh කරනවා
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve doctor');
    }
  };

  // Backend එකෙන් status හෝ accountStatus විදිහට එන්න පුළුවන් නිසා Safe check එකක්
  const getUserStatus = (user) => {
    return user.status || user.accountStatus || 'ACTIVE';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'DOCTOR': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'PATIENT': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse';
      case 'BLOCKED': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return <ShieldCheck className="w-5 h-5 text-rose-600" />;
      case 'DOCTOR': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'PATIENT': return <UserCheck className="w-5 h-5 text-emerald-600" />;
      default: return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const patientCount = users.filter(u => u.role === 'PATIENT').length;
  const doctorCount = users.filter(u => u.role === 'DOCTOR').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const pendingCount = users.filter(u => getUserStatus(u) === 'PENDING').length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛡️ Header section */}
        <div className="mb-8 relative p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Users</span>
              </h1>
            </div>
            <p className="text-slate-400 font-medium text-sm md:text-base ml-11">
              View, approve, and manage all system roles, accounts, and access levels.
            </p>
          </div>
          <div className="relative z-10 flex gap-3">
            <button onClick={fetchUsers} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all border border-white/10 text-sm shadow-lg">
              <RefreshCw className="w-4 h-4" /> Refresh List
            </button>
          </div>
        </div>

        {/* 📊 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Patients</p>
                <p className="text-3xl font-black text-gray-800">{patientCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Doctors</p>
                <p className="text-3xl font-black text-gray-800">{doctorCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admins</p>
                <p className="text-3xl font-black text-gray-800">{adminCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Approval</p>
                <p className="text-3xl font-black text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔍 Search & Filters */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by User Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-700"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="PATIENT">Patients</option>
              <option value="DOCTOR">Doctors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* 🧾 Table */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Users Found</h2>
            <p className="text-gray-500 font-medium max-w-sm">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">User Details</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const userStatus = getUserStatus(user);
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-black text-gray-800">#{user.id}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-rose-50' : user.role === 'DOCTOR' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                              {getRoleIcon(user.role)}
                            </div>
                            <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(userStatus)}`}>
                            {userStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {user.role === 'DOCTOR' && userStatus === 'PENDING' && (
                              <button
                                onClick={() => handleApprove(user.id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-emerald-500 text-white shadow-md shadow-emerald-500/20 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all font-bold text-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.id, user.fullName)}
                              disabled={user.role === 'ADMIN'}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                                user.role === 'ADMIN'
                                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}