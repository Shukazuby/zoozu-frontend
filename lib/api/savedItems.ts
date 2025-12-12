import { apiClient } from './config';
import { BaseResponse, Product } from './types';

export interface SavedItem {
  _id: string;
  productId: Product;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const savedItemsApi = {
  add: async (productId: string): Promise<BaseResponse<SavedItem>> => {
    const response = await apiClient.post(`/saved-items/${productId}`);
    return response.data;
  },
  remove: async (productId: string): Promise<BaseResponse> => {
    const response = await apiClient.delete(`/saved-items/${productId}`);
    return response.data;
  },
  list: async (page?: number, limit?: number): Promise<BaseResponse<SavedItem[]>> => {
    const response = await apiClient.get('/saved-items', { params: { page, limit } });
    return response.data;
  },
  check: async (productId: string): Promise<BaseResponse<{ isSaved: boolean }>> => {
    const response = await apiClient.get(`/saved-items/check/${productId}`);
    return response.data;
  },
};


