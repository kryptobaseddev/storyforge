import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common HTTP methods
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(response => response.data),
    
  post: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(response => response.data),
    
  put: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(response => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(response => response.data),
    
  patch: <T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(response => response.data),
};

export default api; 