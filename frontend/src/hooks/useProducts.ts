import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib'
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types'
import { PRODUCTS_QUERY_KEY } from '@/lib/constants/queryKeys'

export function useProducts() {
  const queryClient = useQueryClient()

  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productsApi.getProducts,
  })

  const createProduct = useCallback(
    async (newProductData: CreateProductRequest) => {
      try {
        const newProduct = await productsApi.createProduct(newProductData)

        queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (currentProducts = []) => [
          newProduct,
          ...currentProducts,
        ])

        return newProduct
      } catch (err) {
        console.error('Error creating product:', err)
        throw err
      }
    },
    [queryClient]
  )

  const updateProduct = useCallback(
    async (productId: number, updatedProductData: UpdateProductRequest) => {
      try {
        const updatedProduct = await productsApi.updateProduct(productId, updatedProductData)

        queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (currentProducts = []) =>
          currentProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        )

        return updatedProduct
      } catch (err) {
        console.error('Error updating product:', err)
        throw err
      }
    },
    [queryClient]
  )

  const deleteProduct = useCallback(
    async (productId: number) => {
      try {
        await productsApi.deleteProduct(productId)

        queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (currentProducts = []) =>
          currentProducts.filter((product) => product.id !== productId)
        )
      } catch (err) {
        console.error('Error deleting product:', err)
        throw err
      }
    },
    [queryClient]
  )

  return useMemo(
    () => ({
      products,
      loading: isLoading,
      error,
      createProduct,
      updateProduct,
      deleteProduct,
      refetch: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    }),
    [products, isLoading, error, createProduct, updateProduct, deleteProduct, queryClient]
  )
}