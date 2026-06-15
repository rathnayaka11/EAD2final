import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import { paymentApi } from '../../api/paymentApi';
import {
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Stethoscope,
  Clock,
  ArrowRight,
  FileEdit,
  Activity,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalEarnings: 0,
    completedAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, paymentsRes] = await Promise.all([
        appointmentApi.getDoctorAppointments(user.userId),
        paymentApi.getDoctorPayments(user.userId),
      ]);

      const appointments = appointmentsRes.data || [];
      const payments = paymentsRes.data || [];

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(a => a.date === today);

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        totalEarnings: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      });

      const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setRecentAppointments(sortedAppointments.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 relative p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Doctor Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">
              Welcome, <span className="text-[#0D5C58]">Dr. {user.fullName}</span> 👋
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Overview of your appointments & earnings.
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border">
            <Stethoscope className="w-10 h-10 text-teal-600" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <StatCard
            icon={<Calendar className="w-7 h-7" />}
            title="Total Appointments"
            value={stats.totalAppointments}
            color="blue"
          />

          <StatCard
            icon={<Users className="w-7 h-7" />}
            title="Today's Appointments"
            value={stats.todayAppointments}
            color="emerald"
          />

          <StatCard
            icon={<CheckCircle className="w-7 h-7" />}
            title="Completed"
            value={stats.completedAppointments}
            color="indigo"
          />

          <div className="bg-[#0D5C58] p-6 rounded-[2rem] shadow-lg text-white">
            <DollarSign className="w-7 h-7 mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-teal-100">
              Total Earnings
            </p>
            <p className="text-3xl font-black mt-1">
              Rs {stats.totalEarnings.toFixed(0)}
            </p>
          </div>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Quick Actions */}
          <div className="lg:col-span-5 space-y-4">

            <QuickLink
              to="/doctor/profile"
              icon={<User className="w-6 h-6" />}
              title="Manage Profile"
              desc="Update consultation fee"
              color="indigo"
            />

            <QuickLink
              to="/doctor/schedule"
              icon={<Clock className="w-6 h-6" />}
              title="Manage Schedule"
              desc="Set availability & timings"
              color="teal"
            />

            <QuickLink
              to="/doctor/appointments"
              icon={<Users className="w-6 h-6" />}
              title="View Appointments"
              desc="Check patient queue"
              color="blue"
            />

            <QuickLink
              to="/doctor/prescriptions/write"
              icon={<FileEdit className="w-6 h-6" />}
              title="Write Prescription"
              desc="Issue new prescriptions"
              color="emerald"
            />

          </div>

          {/* Recent Appointments */}
          <div className="lg:col-span-7 bg-white p-6 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-black mb-6">Recent Appointments</h2>

            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No recent appointments
              </p>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">

                    <div>
                      <p className="font-bold">
                        {appointment.patientName || 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ✅ Small Reusable Components */

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm">
      <div className={`mb-3 text-${color}-600`}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase text-gray-400">{title}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}

function QuickLink({ to, icon, title, desc }) {
  return (
    <Link to={to} className="block bg-white p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}