import { apiClient } from './config';
import { BaseResponse, User } from './types';

export const usersApi = {
  getProfile: async (): Promise<BaseResponse<User>> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  updateProfile: async (payload: Partial<User>): Promise<BaseResponse<User>> => {
    const response = await apiClient.patch('/users/profile', payload);
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string): Promise<BaseResponse> => {
    const response = await apiClient.patch('/users/change-password', { oldPassword, newPassword });
    return response.data;
  },
};


