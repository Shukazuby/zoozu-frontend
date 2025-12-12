import { apiClient } from './config';
import { BaseResponse } from './types';

export interface ShippingCost {
  cost: number;
}

export const shippingApi = {
  // Get current shipping cost
  getCurrentShipping: async (): Promise<BaseResponse<ShippingCost>> => {
    const response = await apiClient.get('/shipping/current');
    return response.data;
  },
};

