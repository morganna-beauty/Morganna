export enum HairType {
  LISO = 'liso',
  ONDULADO = 'ondulado',
  RIZADO = 'rizado',
  AFRO = 'afro',
}

export enum Concern {
  CABELLO_SECO = 'cabelloSeco',
  DANO_REPARACION = 'danoReparacion',
  CONTROL_FRIZ = 'controlFriz',
  VOLUMEN = 'volumen',
}

export enum SortBy {
  PRICE = 'price',
  POPULARITY = 'popularity',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  imageSrc?: string;
  hairType?: HairType;
  concern?: Concern[];
  brand?: string;
  benefits?: string[];
  ingredients?: string[];
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  imageSrc?: string;
  hairType?: HairType;
  concern?: Concern[];
  brand?: string;
  benefits?: string[];
  ingredients?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface FilterProductsRequest {
  hairType?: HairType;
  concern?: Concern[];
  brand?: string;
  search?: string;
  sortBy?: SortBy;
  order?: Order;
}

export interface FilterOptions {
  hairTypes: string[];
  concerns: string[];
  brands: string[];
}
