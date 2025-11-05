export interface CartItem {
  id?: string;
  guestId: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CartItemWithProduct extends Omit<CartItem, 'productId'> {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageSrc?: string;
    brand: string;
  };
  priceAtTime: number;
}

export interface Cart {
  guestId: string;
  items: CartItemWithProduct[];
  totalAmount: number;
  totalItems: number;
  updatedAt: Date;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateQuantityDto {
  productId: string;
  quantity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const cartApi = {
  getCart: async (guestId: string): Promise<Cart> => {
    const response = await fetch(`${API_BASE_URL}/cart/${guestId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data = await response.json();
    
    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
      items: data.items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        updatedAt: new Date(item.updatedAt),
      })),
    };
  },

  addToCart: async (guestId: string, item: AddToCartDto): Promise<CartItem> => {
    const response = await fetch(`${API_BASE_URL}/cart/${guestId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || 'Failed to add item to cart');
    }
    
    const data = await response.json();
    
    return {
      ...data,
      addedAt: new Date(data.addedAt),
      updatedAt: new Date(data.updatedAt),
    };
  },

  removeFromCart: async (guestId: string, productId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cart/${guestId}/items/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || 'Failed to remove item from cart');
    }
  },

  clearCart: async (guestId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cart/${guestId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || 'Failed to clear cart');
    }
  },

  // For quantity updates, we'll remove the item completely and re-add with new quantity
  updateQuantity: async (guestId: string, productId: string, newQuantity: number): Promise<CartItem> => {
    // First remove the existing item
    await cartApi.removeFromCart(guestId, productId);
    
    // Then add it back with the new quantity
    return await cartApi.addToCart(guestId, { productId, quantity: newQuantity });
  },
};