'use client';

import { useState, useCallback } from 'react';
import { ordersApi, type Order, type OrderFilterDto, type CreateOrderDto } from '@/lib/api';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const getOrders = useCallback(async (filters?: OrderFilterDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.getOrders(filters);
      if (response.success && response.data) {
        setOrders(response.data.data);
        setTotalCount(response.data.totalCount);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Orders loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.getOrderById(id);
      if (response.success && response.data) {
        setOrder(response.data);
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
      console.error('Order loading error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (payload: CreateOrderDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.createOrder(payload);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
      console.error('Order creation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const initializePayment = useCallback(async (orderId: string) => {
    try {
      setError(null);
      const response = await ordersApi.initializePayment(orderId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize payment');
      console.error('Payment initialization error:', err);
      return null;
    }
  }, []);

  const getShippingEstimate = useCallback(async (cartItemIds: string[]) => {
    try {
      setError(null);
      const response = await ordersApi.getShippingEstimate({ cartItemIds });
      if (response.success && response.data) {
        return response.data.shippingCost;
      }
      return 0;
    } catch (err: any) {
      console.error('Shipping estimate error:', err);
      return 0;
    }
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    totalCount,
    getOrders,
    getOrderById,
    createOrder,
    initializePayment,
    getShippingEstimate,
  };
}

