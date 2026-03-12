import axios from 'axios';

// For Vercel deployment, use VITE_API_BASE_URL env var
// For local dev, fallback to localhost:5000
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to append JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('wms_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
