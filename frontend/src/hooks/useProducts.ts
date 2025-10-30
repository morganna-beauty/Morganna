'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProtectedActions } from './useProtectedActions';
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
  const { withAdminAuth } = useProtectedActions();
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
    (newProductData: CreateProductRequest) => {
      const protectedAction = withAdminAuth(async () => {
        const newProduct = await productsApi.createProduct(newProductData);

        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });

        return newProduct;
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const updateProduct = useCallback(
    (productId: number, updatedProductData: UpdateProductRequest) => {
      const protectedAction = withAdminAuth(async () => {
        const updatedProduct = await productsApi.updateProduct(productId, updatedProductData);

        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });

        return updatedProduct;
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const deleteProduct = useCallback(
    (productId: number) => {
      const protectedAction = withAdminAuth(async () => {
        await productsApi.deleteProduct(productId);

        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      });

      return protectedAction();
    },
    [queryClient, withAdminAuth]
  );

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  }, [queryClient]);

  const memoizedFilterOptions = useMemo(
    () => filterOptions || { hairTypes: [], concerns: [], brands: [] },
    [filterOptions]
  );

  return useMemo(
    () => ({
      products,
      loading: isLoading,
      error,
      filters,
      filterOptions: memoizedFilterOptions,
      updateFilters,
      clearFilters,
      createProduct,
      updateProduct,
      deleteProduct,
      refetch,
    }),
    [
      products,
      isLoading,
      error,
      filters,
      memoizedFilterOptions,
      updateFilters,
      clearFilters,
      createProduct,
      updateProduct,
      deleteProduct,
      refetch,
    ]
  );
}
 