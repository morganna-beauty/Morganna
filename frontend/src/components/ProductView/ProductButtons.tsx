'use client';

import React, { memo, useCallback, useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

interface ProductButtonsProps {
  product?: Product;
  onAddToBag?: () => void;
  onBuyWhatsApp?: () => void;
  whatsappNumber?: string;
}

const ButtonsProductComponent = ({
  product,
  onAddToBag,
  onBuyWhatsApp,
  whatsappNumber = "+8297236285",
}: ProductButtonsProps) => {
  const { t } = useI18n();
  const { addToCart, isInCart, getItemQuantity, isAddingToCart, sendToWhatsApp } = useCart();

  const productId = useMemo(() => product?.id.toString() || '', [product?.id]);
  
  const isProductInCart = useMemo(() => 
    product ? isInCart(productId) : false, 
    [product, isInCart, productId]
  );
  
  const itemQuantity = useMemo(() => 
    product ? getItemQuantity(productId) : 0, 
    [product, getItemQuantity, productId]
  );

  const handleAddToBag = useCallback(() => {
    if (onAddToBag) {
      onAddToBag();
    } else if (product) {
      addToCart(productId, 1);
    }
  }, [onAddToBag, product, addToCart, productId]);

  const handleBuyWhatsApp = useCallback(() => {
    if (onBuyWhatsApp) {
      onBuyWhatsApp();
    } else if (product) {
      if (!isProductInCart) {
        addToCart(productId, 1);
      }

      setTimeout(() => {
        sendToWhatsApp(whatsappNumber);
      }, 500);
    }
  }, [onBuyWhatsApp, product, isProductInCart, addToCart, sendToWhatsApp, whatsappNumber, productId]);

  const addToBagButtonClasses = useMemo(() => 
    `flex flex-row justify-center items-center px-4 py-2.5 gap-2 rounded-full w-full transition-all ${
      isAddingToCart 
        ? 'bg-gray-300 cursor-not-allowed' 
        : isProductInCart
          ? 'bg-green-100 hover:bg-green-200'
          : 'bg-[#B6D6DD] hover:opacity-80'
    }`, 
    [isAddingToCart, isProductInCart]
  );

  const loadingContent = useMemo(() => (
    <>
      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-600 whitespace-nowrap">
        {t('cart.addingToCart') || 'Agregando...'}
      </span>
    </>
  ), [t]);

  const inCartContent = useMemo(() => (
    <>
      <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium leading-5 tracking-[0.1px] text-green-700 whitespace-nowrap">
        {t('cart.inCart')} ({itemQuantity})
      </span>
    </>
  ), [t, itemQuantity]);

  const addToBagContent = useMemo(() => (
    <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#215E6B] whitespace-nowrap">
      {t('product.addToBag')}
    </span>
  ), [t]);

  const whatsappIcon = useMemo(() => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ), []);

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      
      {/* Añadir a la bolsa */}
      <button
        onClick={handleAddToBag}
        disabled={isAddingToCart}
        className="flex flex-row justify-center items-center w-full h-12 min-h-[48px]"
      >
        <div className={addToBagButtonClasses}>
          {isAddingToCart ? loadingContent : isProductInCart ? inCartContent : addToBagContent}
        </div>
      </button>

      {/* Comprar por WhatsApp */}
      <button
        onClick={handleBuyWhatsApp}
        className="flex flex-row justify-center items-center w-full h-12 min-h-[48px]"
      >
        <div className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 bg-[#215E6B] rounded-full w-full transition-all hover:opacity-80">
          {whatsappIcon}
          <span className="text-sm font-medium leading-5 tracking-[0.1px] text-white whitespace-nowrap">
            {t('product.buyOnWhatsApp')}
          </span>
        </div>
      </button>
    </div>
  );
};

export const ButtonsProduct = memo(ButtonsProductComponent);
ButtonsProduct.displayName = "ButtonsProduct";
