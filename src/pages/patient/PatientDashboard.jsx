import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import { paymentApi } from '../../api/paymentApi';
import { Calendar, CreditCard, FileText, Clock, ArrowRight, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPayments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      const [appointmentsRes, paymentsRes] = await Promise.all([
        appointmentApi.getPatientAppointments(user.userId),
        paymentApi.getPatientPayments(user.userId),
      ]);

      const appointments = appointmentsRes.data;
      const payments = paymentsRes.data;

      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'PENDING').length,
        totalPayments: payments.length,
        pendingPayments: payments.filter(p => p.status === 'PENDING').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-1 md:p-4 min-h-screen font-sans antialiased bg-slate-50/50">
      
      {/* 👋 Welcome Header Section */}
      <div className="mb-10 relative p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              Welcome Back, <span className="text-[#0D5C58] font-black">{user?.fullName || 'Patient'}</span>! 👋
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
              Manage your appointments, payments and digital health records seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-teal-50 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Patient Dashboard</span>
          </div>
        </div>
      </div>

      {/* 📊 4 Premium Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Total Appointments */}
        <div className="relative bg-gradient-to-br from-[#39A9A4] to-[#0D5C58] p-6 rounded-3xl text-white shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-24 h-24" />
          </div>
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md">
              <Calendar className="w-6 h-6 text-teal-100" />
            </div>
            <div className="mt-6">
              <p className="text-teal-50/80 text-xs font-bold uppercase tracking-wider">Total Appointments</p>
              <p className="text-4xl font-black tracking-tight mt-1">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Appointments */}
        <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:border-amber-200 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-24 h-24 text-amber-600" />
          </div>
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="p-3 bg-amber-50 w-fit rounded-2xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
              <p className="text-4xl font-black tracking-tight text-gray-800 mt-1">{stats.pendingAppointments}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Payments */}
        <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="p-3 bg-emerald-50 w-fit rounded-2xl">
              <CreditCard className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Payments Invoice</p>
              <p className="text-4xl font-black tracking-tight text-gray-800 mt-1">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Payments */}
        <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:border-rose-200 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-24 h-24 text-rose-600" />
          </div>
          <div className="flex flex-col justify-between h-full relative z-10">
            <div className="p-3 bg-rose-50 w-fit rounded-2xl">
              <FileText className="w-6 h-6 text-rose-600" />
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Payments</p>
              <p className="text-4xl font-black tracking-tight text-gray-800 mt-1">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 🛠️ Dual Section Layout (Quick Actions + Health Tips) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ⚡ Left Section: Quick Actions */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0D5C58]" /> Quick Operations
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</span>
          </div>
          
          <div className="space-y-4">
            
            {/* Action 1: Book Appointment */}
            <Link to="/patient/book" className="block p-5 bg-[#F3FAF8] border border-teal-50 rounded-2xl hover:bg-[#EBF6F4] hover:border-teal-100 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#0D5C58] text-white rounded-xl shadow-md shadow-teal-900/10">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Book New Appointment</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Schedule a quick visit with a specialist doctor</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition duration-300" />
              </div>
            </Link>

            {/* Action 2: View Appointments */}
            <Link to="/patient/appointments" className="block p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/70 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-teal-700/10 text-[#0D5C58] rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">View Scheduled Appointments</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Check your history and real-time approval status</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition duration-300" />
              </div>
            </Link>

            {/* Action 3: Payments */}
            <Link to="/patient/payments" className="block p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/70 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-teal-700/10 text-[#0D5C58] rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">My Payment Invoices</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">View and manage your recent billing history</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition duration-300" />
              </div>
            </Link>

          </div>
        </div>

        {/* 🍏 Right Section: Premium Health Tips */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Daily Health Tips
            </h2>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">AI Curated</span>
          </div>

          <div className="space-y-4">
            
            {/* Tip 1 */}
            <div className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition duration-300 flex items-start space-x-3">
              <span className="text-xl mt-0.5">💧</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Optimal Hydration</p>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Drink at least 8-10 glasses of clean water daily to maintain exceptional cellular function.</p>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition duration-300 flex items-start space-x-3">
              <span className="text-xl mt-0.5">🏃‍♂️</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Regular Physical Activity</p>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Aim for a minimum of 30 minutes of moderate cardiovascular workout or brisk walking daily.</p>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition duration-300 flex items-start space-x-3">
              <span className="text-xl mt-0.5">🥗</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Balanced Diet</p>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Integrate more organic green leaves, fresh fruits and rich proteins into your core meal plan.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}