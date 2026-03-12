import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend port changes
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
