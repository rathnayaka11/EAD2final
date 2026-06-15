import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Video, XCircle, Stethoscope, ArrowRight, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';

export default function MyAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentApi.getPatientAppointments(user.userId);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentApi.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* 👋 Header Section */}
        <div className="mb-10 relative p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              My <span className="text-[#0D5C58]">Appointments</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
              Track and manage all your upcoming and past medical consultations.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex items-center gap-3">
            <Link 
              to="/patient/book" 
              className="bg-[#0D5C58] hover:bg-teal-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Book New
            </Link>
          </div>
        </div>

        {/* 📋 Content Section */}
        {appointments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Activity className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Appointments Yet</h2>
            <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
              You haven't booked any medical appointments. Start your healthcare journey by scheduling a visit today.
            </p>
            <Link 
              to="/patient/book" 
              className="bg-[#0D5C58] hover:bg-teal-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-900/20 transition-all duration-300 flex items-center gap-2"
            >
              Book Your First Appointment <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Appointments Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 group flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#F3FAF8] rounded-2xl flex items-center justify-center text-[#0D5C58]">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-800 tracking-tight">
                        {/* 💡 ඩොක්ටර්ගේ නම තියෙනවා නම් ඒක පෙන්වනවා, නැත්නම් පරණ ඩේටා වලට "Dr. Bandara Silva" (or default) වැටෙන්න හැදුවා */}
                        {appointment.doctorName ? appointment.doctorName : 'Dr. Bandara Silva'}
                      </h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                        {appointment.type === 'ONLINE' ? 'Online Video' : 'Physical Visit'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-50 flex-grow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <Calendar className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                      <p className="text-sm font-bold text-gray-700">{new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <Clock className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Time</p>
                      <p className="text-sm font-bold text-gray-700">{appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      {appointment.type === 'ONLINE' ? <Video className="w-4 h-4 text-indigo-500" /> : <MapPin className="w-4 h-4 text-rose-500" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Mode</p>
                      <p className="text-sm font-bold text-gray-700">{appointment.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <span className="text-amber-500 font-bold text-xs pl-0.5">Rs</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Fee</p>
                      <p className="text-sm font-bold text-gray-700">{appointment.fee?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Notes (If available) */}
                {appointment.notes && (
                  <div className="mb-6 px-4 py-3 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
                    <p className="text-xs text-amber-700 font-medium">
                      <span className="font-bold">Notes:</span> {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
                  {appointment.status === 'PENDING' ? (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 hover:border-rose-300 font-bold text-sm transition-all duration-300"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Booking
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                      No actions available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}