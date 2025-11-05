import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItem, CartItemWithProduct, Cart } from './entities/cart-item.entity';
import { AddToCartDto } from './dto';
import { ProductsFirestoreService } from '../products/products-firestore.service';
import * as admin from 'firebase-admin';

@Injectable()
export class CartService {
  private readonly collectionName = 'cart_items';

  constructor(private readonly productsService: ProductsFirestoreService) {}

  private get collection(): admin.firestore.CollectionReference {
    return admin.firestore().collection(this.collectionName);
  }

  private convertTimestamp(timestamp: admin.firestore.Timestamp | Date): Date {
    if (timestamp instanceof admin.firestore.Timestamp) {
      return timestamp.toDate();
    }

    return timestamp;
  }

  async getCart(guestId: string): Promise<Cart> {
    try {
      // Simplificamos la consulta para evitar índice compuesto
      const cartItemsQuery = await this.collection
        .where('guestId', '==', guestId)
        .where('isActive', '==', true)
        .get();

      const cartItems: CartItem[] = cartItemsQuery.docs
        .map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            guestId: data.guestId,
            productId: data.productId,
            quantity: data.quantity,
            price: data.price,
            addedAt: this.convertTimestamp(data.addedAt),
            updatedAt: this.convertTimestamp(data.updatedAt),
            isActive: data.isActive,
          };
        })
        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()); // Ordenar por fecha desc

      if (cartItems.length === 0) {
        return {
          guestId,
          items: [],
          totalAmount: 0,
          totalItems: 0,
          updatedAt: new Date(),
        };
      }

      const productIds = [...new Set(cartItems.map((item) => item.productId))];
      const products = await this.productsService.findMultipleByIds(productIds);

      const itemsWithProducts: CartItemWithProduct[] = cartItems
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId);

          if (!product) {
            console.warn(
              `Product ${cartItem.productId} not found for cart item ${cartItem.id}`,
            );

            return null;
          }

          return {
            id: cartItem.id,
            guestId: cartItem.guestId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            addedAt: cartItem.addedAt,
            updatedAt: cartItem.updatedAt,
            isActive: cartItem.isActive,
            product: {
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              imageSrc: product.imageSrc,
              brand: product.brand,
            },
            priceAtTime: cartItem.price,
          };
        })
        .filter((item) => item !== null) as CartItemWithProduct[];

      const totalAmount = itemsWithProducts.reduce(
        (sum, item) => sum + item.priceAtTime * item.quantity,
        0,
      );
      const totalItems = itemsWithProducts.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      return {
        guestId,
        items: itemsWithProducts,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalItems,
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      
      // Si el error es por índices de Firestore, devolvemos carrito vacío
      if (error.code === 9 || error.message?.includes('requires an index')) {
        console.warn('Firestore index required, returning empty cart for now');

        return {
          guestId,
          items: [],
          totalAmount: 0,
          totalItems: 0,
          updatedAt: new Date(),
        };
      }
      
      throw new Error('Failed to retrieve cart');
    }
  }

  async addToCart(guestId: string, addToCartDto: AddToCartDto): Promise<CartItem> {
    try {
      const { productId, quantity } = addToCartDto;

      const product = await this.productsService.findOne(productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const existingItemQuery = await this.collection
        .where('guestId', '==', guestId)
        .where('productId', '==', productId)
        .where('isActive', '==', true)
        .limit(1)
        .get();

      const now = admin.firestore.FieldValue.serverTimestamp();

      if (!existingItemQuery.empty) {
        const existingDoc = existingItemQuery.docs[0];
        const existingData = existingDoc.data();

        await existingDoc.ref.update({
          isActive: false,
          updatedAt: now,
        });

        const newQuantity = existingData.quantity + quantity;
        const newCartItemData = {
          guestId,
          productId,
          quantity: newQuantity,
          price: product.price,
          addedAt: existingData.addedAt,
          updatedAt: now,
          isActive: true,
        };

        const docRef = await this.collection.add(newCartItemData);
        const newDoc = await docRef.get();
        const newData = newDoc.data();

        return {
          id: docRef.id,
          guestId: newData.guestId,
          productId: newData.productId,
          quantity: newData.quantity,
          price: newData.price,
          addedAt: this.convertTimestamp(newData.addedAt),
          updatedAt: this.convertTimestamp(newData.updatedAt),
          isActive: newData.isActive,
        };
      } else {
        const newCartItemData = {
          guestId,
          productId,
          quantity,
          price: product.price,
          addedAt: now,
          updatedAt: now,
          isActive: true,
        };

        const docRef = await this.collection.add(newCartItemData);
        const newDoc = await docRef.get();
        const newData = newDoc.data();

        return {
          id: docRef.id,
          guestId: newData.guestId,
          productId: newData.productId,
          quantity: newData.quantity,
          price: newData.price,
          addedAt: this.convertTimestamp(newData.addedAt),
          updatedAt: this.convertTimestamp(newData.updatedAt),
          isActive: newData.isActive,
        };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async removeFromCart(guestId: string, productId: string): Promise<void> {
    try {
      const existingItemQuery = await this.collection
        .where('guestId', '==', guestId)
        .where('productId', '==', productId)
        .where('isActive', '==', true)
        .limit(1)
        .get();

      if (existingItemQuery.empty) {
        throw new NotFoundException('Cart item not found');
      }

      const existingDoc = existingItemQuery.docs[0];

      await existingDoc.ref.update({
        isActive: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(guestId: string): Promise<void> {
    try {
      const cartItemsQuery = await this.collection
        .where('guestId', '==', guestId)
        .where('isActive', '==', true)
        .get();

      const batch = admin.firestore().batch();
      const now = admin.firestore.FieldValue.serverTimestamp();

      cartItemsQuery.docs.forEach((doc) => {
        batch.update(doc.ref, {
          isActive: false,
          updatedAt: now,
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}