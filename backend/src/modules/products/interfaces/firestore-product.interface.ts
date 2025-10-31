import { HairType, Concern } from '../enums/product.enums';

export interface FirestoreProduct {
  id?: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  imageSrc?: string;
  hairType?: HairType;
  concern?: Concern;
  brand?: string;
  createdAt?: FirebaseFirestore.Timestamp | Date;
  updatedAt?: FirebaseFirestore.Timestamp | Date;
}
