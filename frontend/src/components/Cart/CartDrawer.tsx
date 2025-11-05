'use client';

import React, { useCallback, useMemo, memo } from 'react';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/hooks/useI18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawerComponent: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, clearCart, incrementQuantity, decrementQuantity, sendToWhatsApp, isUpdatingQuantity } = useCart();
  const { t } = useI18n();

  const handleSendToWhatsApp = useCallback(() => {
    sendToWhatsApp();
  }, [sendToWhatsApp]);

  const handleQuantityIncrease = useCallback((productId: string) => {
    incrementQuantity(productId);
  }, [incrementQuantity]);

  const handleQuantityDecrease = useCallback((productId: string) => {
    decrementQuantity(productId);
  }, [decrementQuantity]);

  const isCartEmpty = useMemo(() => 
    !cart?.items || cart.items.length === 0, 
    [cart?.items]
  );

  const closeIcon = useMemo(() => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ), []);

  const emptyCartIcon = useMemo(() => (
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 21v-8a1 1 0 011-1h4a1 1 0 011 1v8" />
    </svg>
  ), []);

  const whatsappIcon = useMemo(() => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309z"/>
    </svg>
  ), []);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('cart.cartSummary')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {closeIcon}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#215E6B] rounded-full animate-spin"></div>
              </div>
            ) : isCartEmpty ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                {emptyCartIcon}
                <p className="text-center">{t('cart.emptyCart')}</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.imageSrc ? (
                        <img
                          src={item.product.imageSrc}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityDecrease(item.product.id)}
                        disabled={isUpdatingQuantity}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityIncrease(item.product.id)}
                        disabled={isUpdatingQuantity}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart?.items && cart.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full bg-[#215E6B] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1a4d57] transition-colors flex items-center justify-center space-x-2"
                >
                  {whatsappIcon}
                  <span>{t('cart.buyViaWhatsApp')}</span>
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('cart.clearCart')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const CartDrawer = memo(CartDrawerComponent);
CartDrawer.displayName = 'CartDrawer';

export default CartDrawer;