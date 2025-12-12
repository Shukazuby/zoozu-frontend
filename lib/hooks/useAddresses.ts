'use client';

import { useCallback, useEffect, useState } from 'react';
import { addressesApi, type Address, type CreateAddressDto, type UpdateAddressDto } from '@/lib/api';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await addressesApi.list();
      if (resp.success && resp.data && Array.isArray(resp.data)) {
        setAddresses(resp.data);
      } else {
        setAddresses([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (payload: CreateAddressDto) => {
    try {
      setError(null);
      const resp = await addressesApi.create(payload);
      if (resp.success && resp.data) {
        await refresh();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address');
      return false;
    }
  }, [refresh]);

  const updateAddress = useCallback(async (id: string, payload: UpdateAddressDto) => {
    try {
      setError(null);
      const resp = await addressesApi.update(id, payload);
      if (resp.success && resp.data) {
        await refresh();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update address');
      return false;
    }
  }, [refresh]);

  const deleteAddress = useCallback(async (id: string) => {
    try {
      setError(null);
      const resp = await addressesApi.remove(id);
      if (resp.success) {
        await refresh();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete address');
      return false;
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    addresses,
    loading,
    error,
    refresh,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}


