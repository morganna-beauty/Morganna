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

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  imageSrc?: string;
  hairType?: HairType;
  concern?: Concern;
  brand?: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  imageSrc?: string;
  hairType?: HairType;
  concern?: Concern;
  brand?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface FilterProductsRequest {
  hairType?: HairType;
  concern?: Concern;
  brand?: string;
  search?: string;
}

export interface FilterOptions {
  hairTypes: string[];
  concerns: string[];
  brands: string[];
}
