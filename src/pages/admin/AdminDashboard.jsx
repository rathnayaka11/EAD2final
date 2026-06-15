import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { paymentApi } from '../../api/paymentApi';
import toast from 'react-hot-toast';
import { Users, DollarSign, UserCheck, Activity, ShieldCheck, ArrowRight, CreditCard, PieChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, paymentsRes] = await Promise.all([
        userApi.getAllUsers(),
        paymentApi.getAllPayments(),
      ]);

      const doctors = usersRes.data.doctors || [];
      const patients = usersRes.data.patients || [];
      const payments = paymentsRes.data || [];

      setStats({
        totalUsers: doctors.length + patients.length,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'SUCCESS').length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const successRate = stats.totalPayments > 0 
    ? ((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1) 
    : 0;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛡️ Header Section */}
        <div className="mb-10 relative p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Background Glows */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dashboard</span>
              </h1>
            </div>
            <p className="text-slate-400 font-medium text-sm md:text-base ml-11">
              Manage system users, monitor activities, and track revenue.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="text-right">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-black tracking-wide">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Users</p>
            <h3 className="text-3xl font-black text-gray-800 relative z-10">{stats.totalUsers}</h3>
          </div>

          {/* Total Patients */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Patients</p>
            <h3 className="text-3xl font-black text-gray-800 relative z-10">{stats.totalPatients}</h3>
          </div>

          {/* Total Doctors */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Doctors</p>
            <h3 className="text-3xl font-black text-gray-800 relative z-10">{stats.totalDoctors}</h3>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Revenue</p>
            <h3 className="text-2xl lg:text-3xl font-black text-gray-800 relative z-10">
              <span className="text-sm font-bold text-gray-400 mr-1">LKR</span> 
              {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ⚡ Quick Actions */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Quick Actions</h2>
            </div>
            
            <div className="space-y-4 flex-1">
              <Link to="/admin/users" className="group block p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 tracking-tight">Manage Users</p>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">View and manage all platform roles</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link to="/admin/payments" className="group block p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 tracking-tight">View Payments</p>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">Monitor all transactions & refunds</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>

          {/* 📈 System Statistics */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <PieChart className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Payment Analytics</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Transactions</p>
                  <p className="text-2xl font-black text-gray-800">{stats.totalPayments}</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="bg-emerald-50/50 p-5 rounded-[1.5rem] border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-600/70 uppercase tracking-widest mb-1">Successful Payments</p>
                  <p className="text-2xl font-black text-emerald-700">{stats.successfulPayments}</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
              </div>

              {/* Progress Bar for Success Rate */}
              <div className="px-2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-600">Success Rate</span>
                  <span className="text-lg font-black text-indigo-600">{successRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 Mini Platform Overview Footer */}
        <div className="mt-8 bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-black text-white tracking-tight">Platform at a Glance</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Live metrics from your database</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 md:gap-12 w-full md:w-auto">
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-400">{stats.totalPatients}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patients</p>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-400">{stats.totalDoctors}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Doctors</p>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{(stats.totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Revenue</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}