import { apiClient } from './config';
import { BaseResponse } from './types';

export interface BespokeFitting {
  _id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  specificRequests?: string;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBespokeFittingDto {
  fullName: string;
  email: string;
  phone: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeSlot: string;
  specificRequests?: string;
}

export interface AvailableSlotsResponse {
  availableSlots: string[];
  bookedSlots: string[];
}

export const bespokeFittingsApi = {
  create: async (payload: CreateBespokeFittingDto): Promise<BaseResponse<BespokeFitting>> => {
    const response = await apiClient.post('/bespoke-fittings', payload);
    return response.data;
  },

  getAvailableSlots: async (date: string): Promise<BaseResponse<AvailableSlotsResponse>> => {
    const response = await apiClient.get('/bespoke-fittings/available-slots', {
      params: { date },
    });
    return response.data;
  },

  getUserFittings: async (): Promise<BaseResponse<BespokeFitting[]>> => {
    const response = await apiClient.get('/bespoke-fittings/my-fittings');
    return response.data;
  },
};

