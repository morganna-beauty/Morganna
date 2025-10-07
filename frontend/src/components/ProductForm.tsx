'use client';

import { useState } from 'react';
import { Product, CreateProductRequest } from '@/types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductRequest) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isEdit = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock !== undefined && formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);

    
return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />

          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>

            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />

            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>

            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />

            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
