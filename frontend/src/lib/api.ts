import axios from 'axios';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  FilterProductsRequest,
  FilterOptions,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types';
import { LoginRequest, AuthResponse } from '@/contexts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('morganna_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('morganna_token');
      localStorage.removeItem('morganna_auth');

      if (!window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }

    return Promise.reject(error);
  }
);
export const productsApi = {
  getProducts: async (filters?: FilterProductsRequest): Promise<Product[]> => {
    const params = new URLSearchParams();

    if (filters?.hairType) params.append('hairType', filters.hairType);
    
    // Handle concerns as array (backend expects 'concerns' as array)
    if (filters?.concern && filters.concern.length > 0) {
      filters.concern.forEach((concern) => {
        params.append('concerns', concern);
      });
    }
    
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.order) params.append('order', filters.order);

    const response = await api.get<Product[]>(`/products?${params.toString()}`);

    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);

    return response.data;
  },

  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', product);

    return response.data;
  },

  updateProduct: async (id: string, product: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, product);

    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get<FilterOptions>('/products/filters/options');

    return response.data;
  },
};

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');

    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);

    return response.data;
  },

  createUser: async (user: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/users', user);

    return response.data;
  },

  updateUser: async (id: string, user: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, user);

    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export const authApi = {
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', loginData);

    return response.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/auth/me');

    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('morganna_token');
    localStorage.removeItem('morganna_auth');
  },
};

export default api;
