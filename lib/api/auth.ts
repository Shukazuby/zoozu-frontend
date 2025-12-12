import { apiClient } from './config';
import { BaseResponse, LoginDto, RegisterDto, AuthResponse } from './types';

export const authApi = {
  // Login
  login: async (payload: LoginDto): Promise<BaseResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  // Register
  register: async (payload: RegisterDto): Promise<BaseResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  // Get current user (if you have this endpoint)
  getCurrentUser: async (): Promise<BaseResponse<any>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Token management helpers
export const tokenManager = {
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null;
  },
};

