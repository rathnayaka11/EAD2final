import axiosInstance from '../utils/axiosInstance';

// POST /api/payments/
export const createPayment = (data) =>
  axiosInstance.post('/api/payments/', data);
// Body: { appointmentId, patientId, doctorId, amount, method: "VISA"|"MASTERCARD"|"FRIMI" }

// GET /api/payments/
export const getAllPayments = () =>
  axiosInstance.get('/api/payments/');

// GET /api/payments/:id
export const getPaymentById = (id) =>
  axiosInstance.get(`/api/payments/${id}`);

// PUT /api/payments/:id/verify
export const verifyPayment = (id) =>
  axiosInstance.put(`/api/payments/${id}/verify`);

// GET /api/payments/patient/:patientId
export const getPatientPayments = (patientId) =>
  axiosInstance.get(`/api/payments/patient/${patientId}`);

// GET /api/payments/doctor/:doctorId
export const getDoctorPayments = (doctorId) =>
  axiosInstance.get(`/api/payments/doctor/${doctorId}`);

// මෙන්න මේ කෑල්ල ෆයිල් එකේ යටින්ම පේස්ට් කරන්න
export const paymentApi = {
  createPayment,
  getAllPayments,
  getPaymentById,
  verifyPayment,
  getPatientPayments,
  getDoctorPayments
};