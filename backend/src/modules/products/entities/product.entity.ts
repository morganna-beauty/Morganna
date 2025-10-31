import { HairType, Concern } from '../enums/product.enums';

export class Product {
  id: number;

  title: string;

  description: string;

  price: number;

  stock: number;

  createdAt: Date;

  updatedAt: Date;

  imageSrc: string;

  hairType: HairType;

  concern: Concern;

  brand: string;
}
