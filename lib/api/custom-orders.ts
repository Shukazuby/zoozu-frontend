import { apiClient } from './config';
import { BaseResponse } from './types';

export interface Measurements {
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  garmentLength?: number;
}

export interface CreateCustomOrderDto {
  productId?: string;
  occasion: string;
  deliveryWindow: string;
  budgetRange?: string;
  garmentType: string;
  measurements?: Measurements;
  preferredFabric?: string;
  preferredColors?: string[];
  designRequests?: string;
}

export interface CustomOrder {
  _id: string;
  userId: string;
  occasion: string;
  deliveryWindow: string;
  budgetRange?: string;
  garmentType: string;
  measurements?: Measurements;
  preferredFabric?: string;
  preferredColors?: string[];
  designRequests?: string;
  status: string;
  quote?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const customOrdersApi = {
  // Submit a custom order request
  create: async (payload: CreateCustomOrderDto): Promise<BaseResponse<CustomOrder>> => {
    const response = await apiClient.post('/custom-orders', payload);
    return response.data;
  },

  // Get custom orders (for authenticated user)
  getAll: async (page?: number, limit?: number): Promise<BaseResponse<CustomOrder[]>> => {
    const response = await apiClient.get('/custom-orders', {
      params: { page, limit },
    });
    return response.data;
  },
};

