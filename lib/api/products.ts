import { apiClient } from './config';
import { BaseResponse, Product } from './types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  gender?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
  sortBy?: string;
  search?: string;
}

export const productsApi = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<BaseResponse<Product[]>> => {
    const response = await apiClient.get('/product', { params: filters });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<BaseResponse<Product[]>> => {
    const response = await apiClient.get('/product/featured/list');
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (): Promise<BaseResponse<Product[]>> => {
    const response = await apiClient.get('/product/new-arrivals');
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<BaseResponse<Product>> => {
    const response = await apiClient.get(`/product/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (filters?: ProductFilters): Promise<BaseResponse<Product[]>> => {
    const response = await apiClient.get('/product/search', { params: filters });
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id: string, data: Partial<Product>): Promise<BaseResponse<Product>> => {
    const response = await apiClient.patch(`/product/${id}`, data);
    return response.data;
  },
};

