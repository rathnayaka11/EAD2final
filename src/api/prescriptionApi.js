import axiosInstance from '../utils/axiosInstance';

export const createPrescription = (data) =>
  axiosInstance.post('/api/prescriptions/', data);

export const getPatientPrescriptions = (patientId) =>
  axiosInstance.get(`/api/prescriptions/patient/${patientId}`);

export const getPrescriptionById = (id) =>
  axiosInstance.get(`/api/prescriptions/${id}`);

// මෙන්න මේ කෑල්ල ෆයිල් එකේ යටින්ම පේස්ට් කරන්න
export const prescriptionApi = {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionById
};