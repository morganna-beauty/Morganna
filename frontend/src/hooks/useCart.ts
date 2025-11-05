import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useGuestId } from './useGuestId';
import { useI18n } from './useI18n';
import { cartApi, type Cart, type AddToCartDto, type UpdateQuantityDto } from '../lib/api/cart';

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

  const getItemQuantity = useCallback((productId: string): number => {
    if (!cart?.items) {
      return 0;
    }

    const item = cart.items.find((item) => item.product.id === productId);

    return item ? item.quantity : 0;
  }, [cart?.items]);


  const addToCartMutation = useMutation({
    mutationFn: (item: AddToCartDto & { showNotification?: boolean }) => {
      const { showNotification, ...cartItem } = item;

      return cartApi.addToCart(guestId, cartItem);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      if (variables.showNotification !== false) {
        toast.success(t('cart.addedToCart'), {
          duration: 3000,
          position: 'bottom-right',
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || t('cart.errorAddingToCart'), {
        duration: 4000,
        position: 'bottom-right',
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeFromCart(guestId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      toast.success(t('cart.removedFromCart'), {
        duration: 3000,
        position: 'bottom-right',
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('cart.errorRemovingFromCart'), {
        duration: 4000,
        position: 'bottom-right',
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      toast.success(t('cart.cartCleared'), {
        duration: 3000,
        position: 'bottom-right',
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('cart.errorClearingCart'), {
        duration: 4000,
        position: 'bottom-right',
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
      cartApi.updateQuantity(guestId, productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousCart = queryClient.getQueryData<Cart>(cartQueryKey);

      if (previousCart) {
        const optimisticCart = {
          ...previousCart,
          items: previousCart.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity }
              : item
          ).filter(item => item.quantity > 0), 
        };
        
        optimisticCart.totalItems = optimisticCart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        optimisticCart.totalAmount = optimisticCart.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
        
        queryClient.setQueryData(cartQueryKey, optimisticCart);
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
      
      toast.error(t('cart.errorAddingToCart'), {
        duration: 4000,
        position: 'bottom-right',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });

  const addToCart = useCallback((productId: string, quantity: number = 1, showNotification: boolean = true) => {
    if (!guestId) {
      toast.error(t('cart.errorGuestIdNotAvailable'), {
        duration: 4000,
        position: 'bottom-right',
      });

      return;
    }

    addToCartMutation.mutate({ productId, quantity, showNotification });
  }, [guestId, addToCartMutation, t]);

  const removeFromCart = useCallback((productId: string) => {
    if (!guestId) {
      toast.error(t('cart.errorGuestIdNotAvailable'), {
        duration: 4000,
        position: 'bottom-right',
      });

      return;
    }

    removeFromCartMutation.mutate(productId);
  }, [guestId, removeFromCartMutation, t]);

  const clearCart = useCallback(() => {
    if (!guestId) {
      toast.error(t('cart.errorGuestIdNotAvailable'), {
        duration: 4000,
        position: 'bottom-right',
      });

      return;
    }

    clearCartMutation.mutate();
  }, [guestId, clearCartMutation, t]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!guestId) {
      toast.error(t('cart.errorGuestIdNotAvailable'), {
        duration: 4000,
        position: 'bottom-right',
      });

      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);

      return;
    }

    updateQuantityMutation.mutate({ productId, quantity });
  }, [guestId, updateQuantityMutation, removeFromCart, t]);

  const incrementQuantity = useCallback((productId: string) => {
    const currentQuantity = getItemQuantity(productId);

    updateQuantity(productId, currentQuantity + 1);
  }, [getItemQuantity, updateQuantity]);

  const decrementQuantity = useCallback((productId: string) => {
    const currentQuantity = getItemQuantity(productId);

    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  }, [getItemQuantity, updateQuantity, removeFromCart]);

  
  const isInCart = useCallback((productId: string): boolean => {
    const quantity = getItemQuantity(productId);
    
    const isInCartResult = quantity > 0;
    
    return isInCartResult;
  }, [getItemQuantity]);  const generateWhatsAppMessage = useCallback((): string => {
    if (!cart?.items || cart.items.length === 0) {
      return t('cart.whatsappGreeting');
    }

    let message = t('cart.whatsappPurchaseMessage') + '\n\n';
    
    cart.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.title}\n`;
      message += `   - ${t('cart.quantity')}: ${item.quantity}\n\n`;
    });

    message += t('cart.whatsappClosing');

    return message;
  }, [cart, t]);

  const sendToWhatsApp = useCallback((phoneNumber?: string) => {
    const defaultPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8297236285';
    
    if (!cart?.items || cart.items.length === 0) {
      const message = t('cart.whatsappGreeting');

      const encodedMessage = encodeURIComponent(message);

      const phone = phoneNumber || defaultPhone;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      return;
    }

    const clearCartConfirmation = window.confirm(
      t('cart.clearCartBeforeWhatsApp') || 
      '¿Quieres vaciar el carrito después de enviar el pedido por WhatsApp?\n\nEsto ayuda a mantener el carrito limpio para futuras compras.'
    );

    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const phone = phoneNumber || defaultPhone;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    if (clearCartConfirmation) {
      setTimeout(() => {
        clearCart();
      }, 1000);
    }
  }, [generateWhatsAppMessage, t, cart, clearCart]);

  return useMemo(() => ({
    cart,
    guestId,
    isLoading: isGuestIdLoading || isCartLoading,
    error: cartError,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    refetchCart,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
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
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    refetchCart,
    addToCartMutation.isPending,
    removeFromCartMutation.isPending,
    clearCartMutation.isPending,
    updateQuantityMutation.isPending,
    getItemQuantity,
    isInCart,
    generateWhatsAppMessage,
    sendToWhatsApp,
  ]);
};