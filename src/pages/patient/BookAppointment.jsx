import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { appointmentApi } from '../../api/appointmentApi';
import { doctorApi } from '../../api/doctorApi';
import toast from 'react-hot-toast';
import { Calendar, Clock, DollarSign, FileText, ArrowLeft, Stethoscope } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: 'PHYSICAL',
    fee: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await userApi.getUsersByRole('DOCTOR');
        setDoctors(response.data);
      } catch {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleDoctorChange = async (e) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, doctorId: selectedId, fee: '' });

    if (selectedId) {
      try {
        // ✅ Fee eka appointment-service ෙකන් fetch කරනවා
        const res = await doctorApi.getDoctorById(selectedId);
        setFormData(prev => ({
          ...prev,
          doctorId: selectedId,
          fee: res.data.fee || ''
        }));
      } catch {
        toast.error('Could not load doctor fee');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const appointmentData = {
        patientId: user.userId,
        doctorId: parseInt(formData.doctorId),
        appointment: {
          date: formData.date,
          time: formData.time + ':00',
          type: formData.type,
          fee: parseFloat(formData.fee),
          notes: formData.notes,
          status: 'PENDING',
        }
      };

      await appointmentApi.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      setTimeout(() => navigate('/patient/appointments'), 1500);
    } catch (error) {
      toast.error('Failed to book appointment');
      console.error(error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h1 className="text-3xl font-black text-gray-800 mb-6">Book Appointment</h1>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Select Doctor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleDoctorChange}
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"
                required
              >
                <option value="">Choose a specialist...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.userId} value={doctor.userId}>
                    Dr. {doctor.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee (Read Only) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Consultation Fee (LKR)</label>
              <input
                type="number"
                value={formData.fee}
                readOnly
                placeholder="Select a doctor to see fee"
                className="w-full p-4 bg-slate-100 border rounded-2xl font-bold text-gray-500"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="p-4 border rounded-2xl"
                required
              />
              <input
                type="time"
                name="time"
                onChange={handleChange}
                className="p-4 border rounded-2xl"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0D5C58] text-white font-bold py-4 rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}