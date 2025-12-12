import { apiClient } from './config';
import { BaseResponse, Cart, CartItem } from './types';

export interface CreateCartItemDto {
  productId: string;
  quantity: number;
}

export const cartApi = {
  // Get current user cart
  getCart: async (): Promise<BaseResponse<Cart>> => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (payload: CreateCartItemDto): Promise<BaseResponse<Cart>> => {
    const response = await apiClient.post('/cart/add', payload);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string): Promise<BaseResponse<Cart>> => {
    const response = await apiClient.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  // Update quantity of a cart item
  updateQuantity: async (cartItemId: string, quantity: number): Promise<BaseResponse<Cart>> => {
    const response = await apiClient.patch(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
  },

  // Clear all cart items
  clearCart: async (): Promise<BaseResponse<Cart>> => {
    const response = await apiClient.delete('/cart/clear/all');
    return response.data;
  },
};

