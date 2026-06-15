import axiosInstance from '../utils/axiosInstance';

export const getAllUsers = () =>
  axiosInstance.get('/api/users');

export const getAllDoctors = () =>
  axiosInstance.get('/api/users/doctors');

export const getAllPatients = () =>
  axiosInstance.get('/api/users/patients');

export const getUserById = (id) =>
  axiosInstance.get(`/api/users/doctors/${id}`);

export const updateUser = (id, data) =>
  axiosInstance.put(`/api/users/doctors/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/api/users/doctors/${id}`);

export const updateDoctorStatus = (id, status) =>
  axiosInstance.put(`/api/users/doctors/${id}/status`, { status: status });

// BookAppointment.jsx-ල use කරන function
export const getUsersByRole = (role) => {
  if (role === 'DOCTOR') return axiosInstance.get('/api/users/doctors');
  if (role === 'PATIENT') return axiosInstance.get('/api/users/patients');
  return axiosInstance.get('/api/users');
};

export const userApi = {
  getAllUsers,
  getAllDoctors,
  getAllPatients,
  getUserById,
  updateUser,
  deleteUser,
  updateDoctorStatus,
  getUsersByRole,
};

export default userApi;