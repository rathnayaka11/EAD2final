import axios from 'axios';

const authAxios = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

export const registerUser = (data) =>
  authAxios.post('/api/auth/register', data);

export const loginUser = (data) =>
  authAxios.post('/api/auth/login', data);

export const authApi = { registerUser, loginUser };
export default authApi;