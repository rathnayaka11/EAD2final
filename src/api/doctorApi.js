import axios from "axios";

const BASE_URL = "http://localhost:8080/api/doctors";

export const doctorApi = {
  getDoctorById: (id) => axios.get(`${BASE_URL}/${id}`),
  updateDoctor: (id, data) => axios.put(`${BASE_URL}/${id}`, data),
};