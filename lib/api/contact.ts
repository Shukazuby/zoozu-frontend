import { apiClient } from './config';
import { BaseResponse } from './types';

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface CreateContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const contactApi = {
  getContactInfo: async (): Promise<BaseResponse<ContactInfo>> => {
    const response = await apiClient.get('/contact/info');
    return response.data;
  },

  submitMessage: async (payload: CreateContactDto): Promise<BaseResponse<ContactMessage>> => {
    const response = await apiClient.post('/contact', payload);
    return response.data;
  },
};

