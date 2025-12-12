'use client';

import { useState, useEffect, useCallback } from 'react';
import { cartApi, tokenManager, type Cart, type CartItem } from '@/lib/api';
import { guestCartStorage } from '@/lib/utils/guestStorage';
import { productsApi, type Product } from '@/lib/api';

// Helper to convert guest cart to Cart format (requires fetching product details)
async function convertGuestCartToCart(guestItems: Array<{ productId: string; quantity: number }>): Promise<Cart> {
  const cartItems: CartItem[] = [];
  let total = 0;
  const unavailableProductIds: string[] = [];

  for (const item of guestItems) {
    try {
      const productResponse = await productsApi.getProductById(item.productId);
      if (productResponse.success && productResponse.data) {
        const product = productResponse.data as Product;
        
        // Check if product is available
        if (!product.isAvailable || !product.isActive) {
          console.warn(`Product ${item.productId} is not available`);
          unavailableProductIds.push(item.productId);
          continue;
        }
        
        const lineTotal = product.price * item.quantity;
        total += lineTotal;

        cartItems.push({
          id: `guest-${item.productId}`,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            category: product.categories && product.categories.length > 0 ? product.categories[0] : '',
          },
          lineTotal,
        });
      } else {
        // Product not found or unavailable
        unavailableProductIds.push(item.productId);
      }
    } catch (err) {
      console.error(`Failed to load product ${item.productId}:`, err);
      unavailableProductIds.push(item.productId);
    }
  }

  // Remove unavailable products from guest cart
  if (unavailableProductIds.length > 0) {
    unavailableProductIds.forEach(productId => {
      guestCartStorage.removeItem(productId);
    });
  }

  return { cart: cartItems, total };
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (tokenManager.isAuthenticated()) {
        // Load authenticated user's cart
        const response = await cartApi.getCart();
        if (response.success && response.data) {
          setCart(response.data);
        } else {
          setCart({ cart: [], total: 0 });
        }
      } else {
        // Load guest cart from localStorage
        const guestItems = guestCartStorage.getCartItems();
        if (guestItems.length > 0) {
          const guestCart = await convertGuestCartToCart(guestItems);
          setCart(guestCart);
        } else {
          setCart({ cart: [], total: 0 });
        }
      }
      return Promise.resolve();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart');
      console.error('Cart loading error:', err);
      setCart({ cart: [], total: 0 });
      return Promise.resolve();
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        // Add to authenticated user's cart
        const response = await cartApi.addToCart({ productId, quantity });
        if (response.success && response.data) {
          setCart(response.data);
          return true;
        }
        return false;
      } else {
        // Add to guest cart (localStorage)
        guestCartStorage.addItem(productId, quantity);
        // Reload cart to update UI
        await loadCart();
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      console.error('Add to cart error:', err);
      return false;
    }
  }, [loadCart]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        // Remove from authenticated user's cart
        const response = await cartApi.removeFromCart(cartItemId);
        if (response.success && response.data) {
          setCart(response.data);
          return true;
        }
        return false;
      } else {
        // Remove from guest cart
        // Extract productId from cartItemId (format: "guest-{productId}")
        const productId = cartItemId.replace('guest-', '');
        guestCartStorage.removeItem(productId);
        await loadCart();
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item from cart');
      console.error('Remove from cart error:', err);
      return false;
    }
  }, [loadCart]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        // Update authenticated user's cart item quantity
        const response = await cartApi.updateQuantity(cartItemId, quantity);
        if (response.success && response.data) {
          setCart(response.data);
          return true;
        }
        return false;
      } else {
        // Update guest cart item quantity
        const productId = cartItemId.replace('guest-', '');
        guestCartStorage.updateQuantity(productId, quantity);
        await loadCart();
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      console.error('Update quantity error:', err);
      return false;
    }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        const response = await cartApi.clearCart();
        if (response.success) {
          setCart({ cart: [], total: 0 });
          return true;
        }
        return false;
      } else {
        guestCartStorage.clearCart();
        setCart({ cart: [], total: 0 });
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      console.error('Clear cart error:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cart,
    loading,
    error,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
