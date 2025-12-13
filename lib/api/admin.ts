import { apiClient } from './config';
import { BaseResponse } from './types';

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<BaseResponse<any>> => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  },

  // Sales Analytics
  getSalesAnalytics: async (
    startDate?: string,
    endDate?: string,
  ): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/admin/analytics/sales', { params });
    return response.data;
  },

  // Users Management
  getAllUsers: async (
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId: string): Promise<BaseResponse<any>> => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, updateData: any): Promise<BaseResponse<any>> => {
    const response = await apiClient.patch(`/admin/users/${userId}`, updateData);
    return response.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<BaseResponse<any>> => {
    const response = await apiClient.patch(`/admin/users/${userId}/suspend`, { isActive });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<BaseResponse<any>> => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Orders Management
  getAllOrders: async (
    page?: number,
    limit?: number,
    filters?: { status?: string; paymentStatus?: string; search?: string },
  ): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (filters?.status) params.status = filters.status;
    if (filters?.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters?.search) params.search = filters.search;
    const response = await apiClient.get('/admin/orders', { params });
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<BaseResponse<any>> => {
    const response = await apiClient.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<BaseResponse<any>> => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Newsletter Management
  getAllNewsletterSubscribers: async (
    page?: number,
    limit?: number,
  ): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await apiClient.get('/admin/newsletter/subscribers', { params });
    return response.data;
  },

  // Bookings Management
  getAllFittings: async (page?: number, limit?: number): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await apiClient.get('/admin/bookings/fittings', { params });
    return response.data;
  },

  getAllCustomOrders: async (page?: number, limit?: number): Promise<BaseResponse<any>> => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await apiClient.get('/admin/bookings/custom-orders', { params });
    return response.data;
  },
};

