'use client';

import { useState, useCallback, useMemo } from 'react';
import { useProducts } from '@/hooks';
import { Product, CreateProductRequest } from '@/types';
import { ProductForm, ProductList } from '@/components';
import { useI18n } from '@/hooks/useI18n';

export default function HomePage() {
  const { t } = useI18n();
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = useCallback(
    async (data: CreateProductRequest) => {
      try {
        await createProduct(data);

        setIsFormOpen(false);
      } catch (error) {
        console.error('Error creating product:', error);
      }
    },
    [createProduct]
  );

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);

    setIsFormOpen(true);
  }, []);

  const handleUpdateProduct = useCallback(
    async (data: CreateProductRequest) => {
      if (!editingProduct) return;

      try {
        await updateProduct(editingProduct.id, data);

        setEditingProduct(null);

        setIsFormOpen(false);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    [editingProduct, updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      if (window.confirm(t('common.confirmDelete'))) {
        try {
          await deleteProduct(id);
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    [deleteProduct, t]
  );

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);

    setEditingProduct(null);
  }, []);

  const handleOpenForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const errorComponent = useMemo(() => {
    if (!error) {
      return null;
    }

    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">{t('common.errorLoading')}</div>

        <div className="text-gray-600">{error.message}</div>

        <button type="button" onClick={() => window.location.reload()} className="mt-4 btn btn-primary">
          {t('common.retry')}
        </button>
      </div>
    );
  }, [error, t]);

  if (error) {
    return errorComponent;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('navbar.products')}</h1>

          <p className="text-gray-600 mt-2">{t('product.manageInventory')}</p>
        </div>

        <button type="button" onClick={handleOpenForm} className="btn btn-primary">
          {t('navbar.addProduct')}
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={handleCloseForm}
                isEdit={!!editingProduct}
              />
            </div>
          </div>
        </div>
      )}

      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
}