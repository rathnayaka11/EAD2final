import axiosInstance from '../utils/axiosInstance';

// POST /api/appointments/book
export const bookAppointment = (data) =>
  axiosInstance.post('/api/appointments/book', data);
// Body: { patientId, doctorId, date, time, type: "PHYSICAL"|"ONLINE", fee, notes }

// GET /api/appointments/patient/:patientId
export const getPatientAppointments = (patientId) =>
  axiosInstance.get(`/api/appointments/patient/${patientId}`);

// GET /api/appointments/doctor/:doctorId
export const getDoctorAppointments = (doctorId) =>
  axiosInstance.get(`/api/appointments/doctor/${doctorId}`);

// PUT /api/appointments/:id/status?status=CONFIRMED
export const updateAppointmentStatus = (id, status) =>
  axiosInstance.put(`/api/appointments/${id}/status`, null, { params: { status } });

// PUT /api/appointments/:id/cancel
export const cancelAppointment = (id) =>
  axiosInstance.put(`/api/appointments/${id}/cancel`);

// POST /api/appointments/schedules
export const addDoctorSchedule = (data) =>
  axiosInstance.post('/api/appointments/schedules', data);

// GET /api/appointments/schedules/doctor/:doctorId
export const getDoctorSchedules = (doctorId) =>
  axiosInstance.get(`/api/appointments/schedules/doctor/${doctorId}`);

export const appointmentApi = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  addDoctorSchedule,
  getDoctorSchedules
};