import axios from 'axios';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  FilterProductsRequest,
  FilterOptions,
} from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  getProducts: async (filters?: FilterProductsRequest): Promise<Product[]> => {
    const params = new URLSearchParams();

    if (filters?.hairType) params.append('hairType', filters.hairType);
    if (filters?.concern) params.append('concern', filters.concern);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<Product[]>(`/products?${params.toString()}`);

    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);

    return response.data;
  },

  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', product);

    return response.data;
  },

  updateProduct: async (id: number, product: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, product);

    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get<FilterOptions>('/products/filters/options');

    return response.data;
  },
};

export default api;
