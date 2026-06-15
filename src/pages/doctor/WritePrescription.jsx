import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import { prescriptionApi } from '../../api/prescriptionApi';
import toast from 'react-hot-toast';
import { FileText, User, Calendar } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function WritePrescription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    diagnosis: '',
    medications: '',
    instructions: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentApi.getDoctorAppointments(user.userId);
      const completedAppointments = response.data.filter(
        a => a.status === 'COMPLETED' || a.status === 'CONFIRMED'
      );
      setAppointments(completedAppointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'appointmentId') {
      const selectedAppointment = appointments.find(a => a.id === parseInt(value));
      if (selectedAppointment) {
        setFormData(prev => ({ ...prev, patientId: selectedAppointment.patientId }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const prescriptionData = {
        appointmentId: parseInt(formData.appointmentId),
        patientId: formData.patientId,
        doctorId: user.userId,
        diagnosis: formData.diagnosis,
        medications: formData.medications,
        instructions: formData.instructions,
      };

      await prescriptionApi.createPrescription(prescriptionData);
      toast.success('Prescription created successfully!');
      setTimeout(() => navigate('/doctor/appointments'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Write Prescription</h1>
        <p className="text-gray-600 mt-2">Create a prescription for your patient</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Appointment
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <select
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleChange}
                className="input-field pl-10"
                required
              >
                <option value="">Choose an appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.patientName || 'Patient'} - {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className="input-field pl-10 min-h-[100px]"
                placeholder="Enter patient diagnosis..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medications
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                className="input-field pl-10 min-h-[150px]"
                placeholder="List medications with dosage and frequency..."
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Example: Paracetamol 500mg - Take 1 tablet every 6 hours
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="input-field pl-10 min-h-[100px]"
                placeholder="Additional instructions for the patient..."
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Example: Take medicines after meals, avoid alcohol, get adequate rest
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? <LoadingSpinner size="sm" /> : 'Create Prescription'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/doctor/appointments')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}