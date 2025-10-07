import axios from 'axios';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, product: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default api;
