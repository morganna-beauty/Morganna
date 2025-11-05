import { useCallback, useMemo } from 'react';
import { useI18n } from './useI18n';
import { useCart } from './useCart';
import { Product } from '@/types';

interface UseProductButtonsProps {
  product?: Product;
  onAddToBag?: () => void;
  onBuyWhatsApp?: () => void;
  whatsappNumber?: string;
}

export const useProductButtons = ({
  product,
  onAddToBag,
  onBuyWhatsApp,
  whatsappNumber = "+18299357237",
}: UseProductButtonsProps) => {
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

  const loadingText = useMemo(() => t('cart.addingToCart') || 'Agregando...', [t]);
  const inCartText = useMemo(() => `${t('cart.inCart')} (${itemQuantity})`, [t, itemQuantity]);
  const addToBagText = useMemo(() => t('product.addToBag'), [t]);
  const whatsappButtonText = useMemo(() => t('product.buyOnWhatsApp'), [t]);

  return useMemo(() => ({
    isProductInCart,
    itemQuantity,
    isAddingToCart,
    productId,
    handleAddToBag,
    handleBuyWhatsApp,
    addToBagButtonClasses,
    loadingText,
    inCartText,
    addToBagText,
    whatsappButtonText,
  }), [
    isProductInCart,
    itemQuantity,
    isAddingToCart,
    productId,
    handleAddToBag,
    handleBuyWhatsApp,
    addToBagButtonClasses,
    loadingText,
    inCartText,
    addToBagText,
    whatsappButtonText,
  ]);
};