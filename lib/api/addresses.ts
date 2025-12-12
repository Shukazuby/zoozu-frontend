import { apiClient } from './config';
import { BaseResponse } from './types';

export interface Address {
  _id: string;
  name?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phone?: string;
  isDefault: boolean;
  label?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressDto {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
  label?: string;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

export const addressesApi = {
  list: async (): Promise<BaseResponse<Address[]>> => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },
  create: async (payload: CreateAddressDto): Promise<BaseResponse<Address>> => {
    const response = await apiClient.post('/addresses', payload);
    return response.data;
  },
  update: async (id: string, payload: UpdateAddressDto): Promise<BaseResponse<Address>> => {
    const response = await apiClient.patch(`/addresses/${id}`, payload);
    return response.data;
  },
  remove: async (id: string): Promise<BaseResponse> => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },
};


