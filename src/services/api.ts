import axios from 'axios';

const api = axios.create({
    // Isi port sesuai dengan port backend
  baseURL: 'http://localhost:5121/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Setiap request otomatis bawa Token (kalau sudah login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;