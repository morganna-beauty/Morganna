import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types';
import { productsApi } from '@/lib';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await productsApi.getProducts();

      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: CreateProductRequest) => {
    try {
      setError(null);
      const newProduct = await productsApi.createProduct(productData);

      setProducts((prev) => [newProduct, ...prev]);

      return newProduct;
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: UpdateProductRequest) => {
    try {
      setError(null);

      const updatedProduct = await productsApi.updateProduct(id, productData);

      setProducts((prev) => prev.map((product) => (product.id === id ? updatedProduct : product)));

      return updatedProduct;
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setError(null);

      await productsApi.deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return useMemo(
    () => ({
      products,
      loading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct]
  );
}
