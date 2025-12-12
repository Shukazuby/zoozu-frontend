'use client';

import { useCallback, useEffect, useState } from 'react';
import { savedItemsApi, type SavedItem } from '@/lib/api';
import { tokenManager } from '@/lib/api';
import { guestSavedItemsStorage } from '@/lib/utils/guestStorage';

export function useSavedItems(productId?: string) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (page?: number, limit?: number) => {
      try {
        setLoading(true);
        setError(null);

        if (tokenManager.isAuthenticated()) {
          const resp = await savedItemsApi.list(page, limit);
          if (resp.success && resp.data) {
            setItems(Array.isArray(resp.data) ? resp.data : []);
          } else {
            setItems([]);
          }
        } else {
          // Load guest saved items from localStorage
          const guestSavedIds = guestSavedItemsStorage.getSavedItems();
          // Convert to SavedItem format (simplified, without product details)
          // Note: For guest items, productId is stored as string, but SavedItem expects Product object
          // We'll use type assertion since guest items are temporary and will sync on login
          const now = new Date().toISOString();
          setItems(guestSavedIds.map(id => ({
            _id: `guest-${id}`,
            productId: id as any, // Guest items store productId as string, will be synced on login
            userId: '',
            createdAt: now,
            updatedAt: now,
          } as SavedItem)));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load saved items');
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const check = useCallback(async () => {
    if (!productId) {
      setIsSaved(false);
      return false;
    }

    if (tokenManager.isAuthenticated()) {
      try {
        const resp = await savedItemsApi.check(productId);
        if (resp.success && resp.data) {
          setIsSaved(!!resp.data.isSaved);
          return !!resp.data.isSaved;
        }
        setIsSaved(false);
        return false;
      } catch (err: any) {
        setIsSaved(false);
        return false;
      }
    } else {
      // Check guest saved items
      const saved = guestSavedItemsStorage.isSaved(productId);
      setIsSaved(saved);
      return saved;
    }
  }, [productId]);

  const add = useCallback(async () => {
    if (!productId) return false;
    
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        const resp = await savedItemsApi.add(productId);
        if (resp.success) {
          setIsSaved(true);
          return true;
        }
        return false;
      } else {
        // Add to guest saved items
        guestSavedItemsStorage.addItem(productId);
        setIsSaved(true);
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save item');
      return false;
    }
  }, [productId]);

  const remove = useCallback(async () => {
    if (!productId) return false;
    
    try {
      setError(null);

      if (tokenManager.isAuthenticated()) {
        const resp = await savedItemsApi.remove(productId);
        if (resp.success) {
          setIsSaved(false);
          return true;
        }
        return false;
      } else {
        // Remove from guest saved items
        guestSavedItemsStorage.removeItem(productId);
        setIsSaved(false);
        return true;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove saved item');
      return false;
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      check();
    }
  }, [productId, check]);

  return {
    items,
    isSaved,
    loading,
    error,
    refresh,
    add,
    remove,
    check,
  };
}
