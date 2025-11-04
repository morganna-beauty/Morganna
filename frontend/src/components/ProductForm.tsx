'use client';

import { useState, useCallback } from 'react';
import { CreateProductRequest } from '@/types';
import { useI18n } from '@/hooks/useI18n';
import { ImageUpload } from './ImageUpload';
import ProductFormProps from '@/interface/ProductForm';

export const ProductForm = ({ product, onSubmit, onCancel, isEdit = false }: ProductFormProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock,
    imageSrc: product?.imageSrc,
    hairType: product?.hairType,
    concern: product?.concern,
    brand: product?.brand || '',
    benefits: product?.benefits || [],
    ingredients: product?.ingredients || [],
  });

  const [priceInput, setPriceInput] = useState<string>(
    product?.price ? product.price.toString() : ''
  );
  const [stockInput, setStockInput] = useState<string>(
    product?.stock ? product.stock.toString() : ''
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.name = t('product.nameRequired');
    }

    const priceValue = Number(priceInput);

    if (priceInput === '' || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = t('product.priceRequired');
    }

    const stockValue = Number(stockInput);

    if (stockInput !== '' && (isNaN(stockValue) || stockValue < 0)) {
      newErrors.stock = t('product.stockNegative');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData.title, priceInput, stockInput, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      try {
        // Preparar los datos finales con valores numéricos correctos
        const finalFormData = {
          ...formData,
          price: Number(priceInput) || 0,
          stock: stockInput === '' ? undefined : Number(stockInput),
        };

        await onSubmit(finalFormData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    },
    [validateForm, onSubmit, formData, priceInput, stockInput]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === 'price') {
        setPriceInput(value);
        setFormData((prev) => ({
          ...prev,
          price: value === '' ? 0 : Number(value) || 0,
        }));
      } else if (name === 'stock') {
        setStockInput(value);
        setFormData((prev) => ({
          ...prev,
          stock: value === '' ? undefined : Number(value) || 0,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleImageSelect = useCallback((imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageSrc: imageUrl,
    }));
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? t('product.edit') : t('product.createNew')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('product.name')} *
          </label>

          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('product.enterName')}
          />

          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t('product.description')}
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={t('product.enterDescription')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              {t('product.price')} ($) *
            </label>

            <input
              type="number"
              id="price"
              name="price"
              value={priceInput}
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
              {t('product.stockQuantity')}
            </label>

            <input
              type="number"
              id="stock"
              name="stock"
              value={stockInput}
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

        {/* Imagen del producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('product.image')}
          </label>

          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={formData.imageSrc}
            className="w-full"
          />
        </div>

        {/* Campos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="hairType" className="block text-sm font-medium text-gray-700 mb-1">
              {t('product.hairType')}
            </label>

            <select
              id="hairType"
              name="hairType"
              value={formData.hairType || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('product.selectType')}</option>

              <option value="liso">Liso</option>

              <option value="ondulado">Ondulado</option>

              <option value="rizado">Rizado</option>

              <option value="afro">Afro</option>
            </select>
          </div>

          <div>
            <label htmlFor="concern" className="block text-sm font-medium text-gray-700 mb-1">
              {t('product.concern')}
            </label>

            <select
              id="concern"
              name="concern"
              value={formData.concern || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('product.selectConcern')}</option>

              <option value="cabelloSeco">Cabello Seco</option>

              <option value="danoReparacion">Daño y Reparación</option>

              <option value="controlFriz">Control de Friz</option>

              <option value="volumen">Volumen</option>
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              {t('product.brand')}
            </label>

            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t('product.brandPlaceholder')}
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div>
          <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
            Beneficios del Producto
          </label>
          <textarea
            id="benefits"
            name="benefits"
            value={(formData.benefits || []).join('\n')}
            onChange={(e) => {
              const benefits = e.target.value.split('\n').filter(benefit => benefit.trim() !== '');

              setFormData(prev => ({ ...prev, benefits }));
            }}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ingresa cada beneficio en una línea nueva&#10;Ejemplo:&#10;Hidrata el cabello&#10;Reduce el frizz&#10;Fortalece las fibras capilares"
          />
          <p className="mt-1 text-sm text-gray-500">
            Ingresa cada beneficio en una línea nueva
          </p>
        </div>

        {/* Ingredients Section */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
            Ingredientes del Producto
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={(formData.ingredients || []).join('\n')}
            onChange={(e) => {
              const ingredients = e.target.value.split('\n').filter(ingredient => ingredient.trim() !== '');

              setFormData(prev => ({ ...prev, ingredients }));
            }}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ingresa cada ingrediente en una línea nueva&#10;Ejemplo:&#10;Aceite de Argán&#10;Keratina hidrolizada&#10;Extracto de aloe vera"
          />
          <p className="mt-1 text-sm text-gray-500">
            Ingresa cada ingrediente en una línea nueva
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('common.saving') : isEdit ? t('product.update') : t('product.create')}
          </button>
        </div>
      </form>
    </div>
  );
};
