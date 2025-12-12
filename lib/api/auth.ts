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

  /**
   * Check if token is expired (quick check without decoding)
   * For detailed expiration check, use isTokenExpired from adminAuth utils
   */
  isTokenExpired: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return true;
    
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return true;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      if (!decoded || !decoded.exp) return true;
      
      // Check if token expires in less than 1 minute (buffer time)
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      return currentTime >= expirationTime - 60000;
    } catch (error) {
      return true;
    }
  },
};

