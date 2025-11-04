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