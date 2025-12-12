import { apiClient } from './config';
import { BaseResponse } from './types';

export interface SubscribeNewsletterDto {
  email: string;
  name?: string;
}

export const newsletterApi = {
  subscribe: async (payload: SubscribeNewsletterDto): Promise<BaseResponse<{ email: string; name?: string }>> => {
    const response = await apiClient.post('/newsletter/subscribe', payload);
    return response.data;
  },
};

