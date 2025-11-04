import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { useGuestId } from './useGuestId';
import { useI18n } from './useI18n';
import { cartApi, type Cart, type AddToCartDto } from '../lib/api/cart';

const notify = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message),
};

export const useCart = () => {
  const { guestId, isLoading: isGuestIdLoading } = useGuestId();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const cartQueryKey = useMemo(() => ['cart', guestId], [guestId]);

  const {
    data: cart,
    isLoading: isCartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => cartApi.getCart(guestId),
    enabled: !!guestId && !isGuestIdLoading,
    staleTime: 30000,
    gcTime: 300000,
  });

  const addToCartMutation = useMutation({
    mutationFn: (item: AddToCartDto) => cartApi.addToCart(guestId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      notify.success(t('cart.addedToCart'));
    },
    onError: (error: Error) => {
      notify.error(error.message || t('cart.errorAddingToCart'));
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeFromCart(guestId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      notify.success(t('cart.removedFromCart'));
    },
    onError: (error: Error) => {
      notify.error(error.message || t('cart.errorRemovingFromCart'));
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      notify.success(t('cart.cartCleared'));
    },
    onError: (error: Error) => {
      notify.error(error.message || t('cart.errorClearingCart'));
    },
  });

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    if (!guestId) {
      notify.error(t('cart.errorGuestIdNotAvailable'));

      return;
    }

    addToCartMutation.mutate({ productId, quantity });
  }, [guestId, addToCartMutation, t]);

  const removeFromCart = useCallback((productId: string) => {
    if (!guestId) {
      notify.error(t('cart.errorGuestIdNotAvailable'));

      return;
    }

    removeFromCartMutation.mutate(productId);
  }, [guestId, removeFromCartMutation, t]);

  const clearCart = useCallback(() => {
    if (!guestId) {
      notify.error(t('cart.errorGuestIdNotAvailable'));

      return;
    }

    clearCartMutation.mutate();
  }, [guestId, clearCartMutation, t]);

  const getItemQuantity = useCallback((productId: string): number => {
    if (!cart?.items) return 0;

    const item = cart.items.find((item) => item.product.id === productId);

    return item ? item.quantity : 0;
  }, [cart?.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return getItemQuantity(productId) > 0;
  }, [getItemQuantity]);  const generateWhatsAppMessage = useCallback((): string => {
    if (!cart?.items || cart.items.length === 0) {
      return t('cart.whatsappGreeting');
    }

    let message = t('cart.whatsappPurchaseMessage') + '\n\n';
    
    cart.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.title}\n`;
      message += `   - ${t('cart.quantity')}: ${item.quantity}\n`;
      message += `   - ${t('cart.unitPrice')}: $${item.priceAtTime.toFixed(2)}\n`;
      message += `   - ${t('cart.subtotal')}: $${(item.priceAtTime * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 ${t('cart.total')}: $${cart.totalAmount.toFixed(2)}\n\n`;
    message += t('cart.whatsappClosing');

    return message;
  }, [cart, t]);

  const sendToWhatsApp = useCallback((phoneNumber?: string) => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }, [generateWhatsAppMessage]);

  return useMemo(() => ({
    cart,
    guestId,
    isLoading: isGuestIdLoading || isCartLoading,
    error: cartError,
    addToCart,
    removeFromCart,
    clearCart,
    refetchCart,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    getItemQuantity,
    isInCart,
    generateWhatsAppMessage,
    sendToWhatsApp,
    totalItems: cart?.totalItems || 0,
    totalAmount: cart?.totalAmount || 0,
    isEmpty: !cart?.items || cart.items.length === 0,
  }), [
    cart,
    guestId,
    isGuestIdLoading,
    isCartLoading,
    cartError,
    addToCart,
    removeFromCart,
    clearCart,
    refetchCart,
    addToCartMutation.isPending,
    removeFromCartMutation.isPending,
    clearCartMutation.isPending,
    getItemQuantity,
    isInCart,
    generateWhatsAppMessage,
    sendToWhatsApp,
  ]);
};