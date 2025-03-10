import { apiClient } from '@/app/utils/client';
import { Product } from '@/interfaces/Product';

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/product/');
    return response.data;
  },
};
