import { apiClient } from './config';
import { BaseResponse, Order, CreateOrderDto, OrderFilterDto, UpdateOrderDto, ShippingEstimateDto, ShippingEstimate } from './types';

export const ordersApi = {
  // Create a new order from cart items
  createOrder: async (payload: CreateOrderDto): Promise<BaseResponse<Order>> => {
    const response = await apiClient.post('/orders', payload);
    return response.data;
  },

  // List orders with filters
  getOrders: async (filters?: OrderFilterDto): Promise<BaseResponse<{ totalCount: number; data: Order[] }>> => {
    const response = await apiClient.get('/orders', { params: filters });
    return response.data;
  },

  // Get a single order by id
  getOrderById: async (id: string): Promise<BaseResponse<Order>> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Update an order
  updateOrder: async (id: string, payload: UpdateOrderDto): Promise<BaseResponse<Order>> => {
    const response = await apiClient.patch(`/orders/${id}`, payload);
    return response.data;
  },

  // Delete an order
  deleteOrder: async (id: string): Promise<BaseResponse<void>> => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },

  // Initialize Paystack payment for an order
  initializePayment: async (orderId: string): Promise<BaseResponse<{ authorizationUrl: string; reference: string }>> => {
    const response = await apiClient.post(`/orders/${orderId}/paystack/initialize`);
    return response.data;
  },

  // Get shipping cost estimate
  getShippingEstimate: async (payload: ShippingEstimateDto): Promise<BaseResponse<ShippingEstimate>> => {
    const response = await apiClient.post('/orders/shipping/estimate', payload);
    return response.data;
  },
};

