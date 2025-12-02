import axios from 'axios';

// 1. Crear la instancia con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5036/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;