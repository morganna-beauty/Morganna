'use client';

import { useState, useCallback, useMemo } from 'react';
import { useProducts } from '@/hooks';
import { Product, CreateProductRequest } from '@/types';
import { ProductForm, ProductList, Tooltip } from '@/components';
import { useI18n } from '@/hooks/useI18n';
import { HiPlus } from 'react-icons/hi';

export default function AdminPage() {
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
    if (!error) return null;

    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">{t('common.errorLoading')}</div>

        <div className="text-gray-600">{error.message}</div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 btn btn-primary"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }, [error, t]);

  if (error) return errorComponent;

  return (
    <>
      <div className="flex items-center justify-between mt-6 mb-4 px-[60px]">
        <div>
          <h2 className="text-2xl font-bold">{t('product.inventory')}</h2>

          <p className="text-gray-600 mt-2">{t('product.manageInventory')}</p>
        </div>

        <Tooltip content={t('navbar.addProduct')} position="top">
          <button
            type="button"
            onClick={handleOpenForm}
            className="btn btn-primary flex items-center gap-2 hover:shadow-lg transition-all duration-200"
          >
            <HiPlus size={20} />

            <span className="hidden sm:inline">{t('navbar.addProduct')}</span>

            <span className="sm:hidden">Add</span>
          </button>
        </Tooltip>
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

      <div className="px-[60px]">
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          loading={loading}
        />
      </div>
    </>
  );
}
