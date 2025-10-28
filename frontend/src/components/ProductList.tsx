'use client';

import { useMemo } from 'react';
import { formatCurrency, formatDate } from '@/lib';
import { useI18n } from '@/hooks/useI18n';
import ProductListProps from '@/interface/ProductList';
import { useIsDesktop } from '@/hooks/useResponsive';
import { HiPencil, HiTrash } from 'react-icons/hi';

export const ProductList = ({ products, onEdit, onDelete, loading }: ProductListProps) => {
  const { t } = useI18n();
  const isDesktop = useIsDesktop();

  const loadingComponent = useMemo(
    () => (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    ),
    []
  );

  const emptyStateComponent = useMemo(
    () => (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">{t('product.noProducts')}</div>

        <div className="text-gray-400 text-sm mt-2">{t('product.createFirst')}</div>
      </div>
    ),
    [t]
  );

  if (loading) {
    return loadingComponent;
  }

  if (products.length === 0) {
    return emptyStateComponent;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {!isDesktop && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700 flex items-center justify-between">
          <span>💡 {t('product.scrollHint')}</span>

          <span className="text-blue-500">&larr;&rarr;</span>
        </div>
      )}

      <div
        className={`${!isDesktop ? 'overflow-x-auto pb-1' : ''}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6',
          ...(!isDesktop && {
            WebkitOverflowScrolling: 'touch',
          }),
        }}
      >
        <table
          className={`divide-y divide-gray-200 ${isDesktop ? 'min-w-full' : 'min-w-[900px] w-full'}`}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product.product')}
              </th>

              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product.typeAndConcern')}
              </th>

              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product.price')}
              </th>

              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product.stock')}
              </th>

              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product.created')}
              </th>

              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                {t('common.actions')}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.imageSrc && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.imageSrc}
                          alt={product.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className={product.imageSrc ? 'ml-4' : ''}>
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>

                      {product.brand && (
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      )}

                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.hairType && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                        {product.hairType.charAt(0).toUpperCase() + product.hairType.slice(1)}
                      </span>
                    )}

                    {product.concern && (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {product.concern}
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(product.price)}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {`${product.stock} ${t('product.units')}`}
                  </span>
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(product.createdAt)}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 sticky right-0 bg-white">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="inline-flex items-center justify-center w-8 h-8 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-all duration-200"
                      title={t('common.edit')}
                      aria-label={t('common.edit')}
                    >
                      <HiPencil className="w-6 h-6" />
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-all duration-200"
                      title={t('common.delete')}
                      aria-label={t('common.delete')}
                    >
                      <HiTrash className="w-6 h-6" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
