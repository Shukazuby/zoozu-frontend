import axios from 'axios';

// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://0ab3ec2490b9.ngrok-free.app';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add ngrok headers if using ngrok
    ...(API_BASE_URL.includes('ngrok') && {
      'ngrok-skip-browser-warning': 'true',
    }),
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or wherever you store it)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Unauthorized or Forbidden - clear token and redirect to appropriate login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        localStorage.removeItem('auth_token');
        
        // If on admin routes, redirect to admin login
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          // Otherwise redirect to regular login
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

