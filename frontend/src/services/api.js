import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: 'http://localhost:8001',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Something went wrong';

    toast.error(message);
    return Promise.reject(error);
  },
);

export default API;
