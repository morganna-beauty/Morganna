'use client';

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';

export default function CartPage() {
  const { cart, isLoading, removeFromCart, clearCart, incrementQuantity, decrementQuantity, sendToWhatsApp, isUpdatingQuantity } = useCart();
  const { t } = useI18n();

  const handleQuantityIncrease = useCallback((productId: string) => {
    incrementQuantity(productId);
  }, [incrementQuantity]);

  const handleQuantityDecrease = useCallback((productId: string) => {
    decrementQuantity(productId);
  }, [decrementQuantity]);

  const handleSendToWhatsApp = useCallback(() => {
    sendToWhatsApp();
  }, [sendToWhatsApp]);

  const isCartEmpty = useMemo(() => 
    !cart?.items || cart.items.length === 0, 
    [cart?.items]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#215E6B] rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-800">{t('cart.home')}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{t('cart.cartSummary')}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">{t('cart.cartSummary')}</h1>
        </div>

        {isCartEmpty ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 21v-8a1 1 0 011-1h4a1 1 0 011 1v8" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('cart.emptyCart')}</h2>
            <p className="text-gray-600 mb-8">
              {t('cart.emptyCartDescription')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#215E6B] hover:bg-[#1a4d57] transition-colors"
            >
              {t('cart.viewProducts')}
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('cart.products')} ({cart?.totalItems || 0} {cart?.totalItems === 1 ? t('cart.products').slice(0, -1) : t('cart.products')})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="px-6 py-6">
                      <div className="flex items-center">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.imageSrc ? (
                            <img
                              src={item.product.imageSrc}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link 
                                  href={`/products/${item.product.id}`}
                                  className="hover:text-[#215E6B] transition-colors"
                                >
                                  {item.product.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{item.product.brand}</p>
                              {item.product.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                  {item.product.description}
                                </p>
                              )}
                            </div>
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityDecrease(item.product.id)}
                                disabled={isUpdatingQuantity}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                -
                              </button>
                              <span className="mx-4 text-lg font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityIncrease(item.product.id)}
                                disabled={isUpdatingQuantity}
                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                  >
                    {t('cart.clearCart')}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('cart.orderSummary')}
                </h3>


                {/* Checkout Button */}
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full bg-[#215E6B] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#1a4d57] transition-colors flex items-center justify-center space-x-3 mb-4"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309z"/>
                  </svg>
                  <span>{t('cart.buyViaWhatsApp')}</span>
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block w-full text-center border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('cart.continueShopping')}
                </Link>

                {/* Security Info */}
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('cart.secureCheckout')}</span>
                  </div>
                  <p>{t('cart.dataProtection')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}