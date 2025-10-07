'use client';

import { useState } from 'react';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { Product, CreateProductRequest } from '@/types/product';

export default function HomePage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = async (data: CreateProductRequest) => {
    try {
      await createProduct(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleUpdateProduct = async (data: CreateProductRequest) => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading products</div>

        <div className="text-gray-600">{error}</div>

        <button onClick={() => window.location.reload()} className="mt-4 btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>

          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>

        <button onClick={() => setIsFormOpen(true)} className="btn btn-primary">
          Add New Product
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
