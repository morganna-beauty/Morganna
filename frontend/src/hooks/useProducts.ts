import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  FilterProductsRequest,
  FilterOptions,
} from '@/types';
import { PRODUCTS_QUERY_KEY } from '@/lib/constants/queryKeys';

export function useProducts() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterProductsRequest>({});

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: () => productsApi.getProducts(filters),
  });

  const { data: filterOptions } = useQuery<FilterOptions, Error>({
    queryKey: ['products', 'filter-options'],
    queryFn: productsApi.getFilterOptions,
  });

  const updateFilters = useCallback((newFilters: FilterProductsRequest) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const createProduct = useCallback(
    async (newProductData: CreateProductRequest) => {
      try {
        const newProduct = await productsApi.createProduct(newProductData);

        // Invalidate all product queries to refetch with current filters
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });

        return newProduct;
      } catch (err) {
        console.error('Error creating product:', err);
        throw err;
      }
    },
    [queryClient]
  );

  const updateProduct = useCallback(
    async (productId: number, updatedProductData: UpdateProductRequest) => {
      try {
        const updatedProduct = await productsApi.updateProduct(productId, updatedProductData);

        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });

        return updatedProduct;
      } catch (err) {
        console.error('Error updating product:', err);
        throw err;
      }
    },
    [queryClient]
  );

  const deleteProduct = useCallback(
    async (productId: number) => {
      try {
        await productsApi.deleteProduct(productId);

        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      } catch (err) {
        console.error('Error deleting product:', err);
        throw err;
      }
    },
    [queryClient]
  );

  return useMemo(
    () => ({
      products,
      loading: isLoading,
      error,
      filters,
      filterOptions: filterOptions || { hairTypes: [], concerns: [], brands: [] },
      updateFilters,
      clearFilters,
      createProduct,
      updateProduct,
      deleteProduct,
      refetch: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
    }),
    [
      products,
      isLoading,
      error,
      filters,
      filterOptions,
      updateFilters,
      clearFilters,
      createProduct,
      updateProduct,
      deleteProduct,
      queryClient,
    ]
  );
}
