import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Video, XCircle, Stethoscope, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function MyAppointments() {
  const { user } = useAuth();
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
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentApi.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8">My Appointments</h1>
        
        {appointments.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2.5rem] border shadow-sm">
            <Activity className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-black">No Appointments Yet</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white p-6 rounded-[2rem] border shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <div>
                      {/* 💡 මෙන්න මෙතන තමයි වැදගත්ම වෙනස - Doctor Object එකෙන් නම ගන්නවා */}
                      <h3 className="text-xl font-black text-gray-800">
                        {appointment.doctor ? `Dr. ${appointment.doctor.name}` : 'Doctor Unavailable'}
                      </h3>
                      <p className="text-sm font-bold text-gray-400 uppercase">{appointment.type}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-xl text-xs font-black uppercase ${appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-3xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <p className="text-sm font-bold text-gray-700">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <p className="text-sm font-bold text-gray-700">{appointment.time}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-end">
                  {appointment.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
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