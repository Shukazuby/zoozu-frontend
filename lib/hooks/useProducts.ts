'use client';

import { useState, useCallback } from 'react';
import { productsApi, type Product, type ProductFilters } from '@/lib/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const getProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProducts(filters);
      if (response.success && response.data) {
        // Backend returns: { data: Product[], success: true, totalCount: number, ... }
        const products = Array.isArray(response.data) ? response.data : [];
        const total = response.totalCount || products.length;
        setProducts(products);
        setTotalCount(total);
        return products; // Return products for use in product details page
      }
      setProducts([]);
      setTotalCount(0);
      return [];
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Products loading error:', err);
      setProducts([]);
      setTotalCount(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getFeaturedProducts();
      
      // Backend returns: { data: Product[], success: true, code: 200, message: '...' }
      // axios wraps it, so response.data is the backend response object
      // Therefore: response.data.data is the Product[] array
      if (response && response.success) {
        // response.data is the backend response object { data: [...], success: true, ... }
        // So response.data.data is the actual array of products
        let products: Product[] = [];
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            // response.data is directly an array
            products = response.data;
          } else if (typeof response.data === 'object' && 'data' in response.data) {
            // response.data is an object with a data property
            const nestedData = (response.data as any).data;
            if (Array.isArray(nestedData)) {
              products = nestedData;
            }
          }
        }
        
        setFeaturedProducts(products);
      } else {
        console.warn('[Featured Products] Invalid response:', response);
        setFeaturedProducts([]);
      }
    } catch (err: any) {
      console.error('[Featured Products] Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load featured products';
      setError(errorMessage);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewArrivals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getNewArrivals();
      if (response.success && response.data) {
        setNewArrivals(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load new arrivals');
      console.error('New arrivals loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setProduct(null); // Clear previous product
      const response = await productsApi.getProductById(id);
      if (response.success && response.data) {
        setProduct(response.data);
        return response.data;
      }
      // If response is not successful but no error thrown, product doesn't exist
      setError('Product not found');
      setProduct(null);
      return null;
    } catch (err: any) {
      // Handle 404 specifically
      if (err.response?.status === 404) {
        setError('Product not found');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load product. Please try again.');
      }
      console.error('Product loading error:', err);
      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.searchProducts(filters);
      if (response.success && response.data) {
        setProducts(Array.isArray(response.data) ? response.data : []);
        setTotalCount(response.totalCount || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search products');
      console.error('Product search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    featuredProducts,
    newArrivals,
    product,
    loading,
    error,
    totalCount,
    getProducts,
    getFeaturedProducts,
    getNewArrivals,
    getProductById,
    searchProducts,
  };
}

