export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  imageSrc?: string;
  hairType?: 'liso' | 'ondulado' | 'rizado' | 'afro';
  concern?: 'cabelloSeco' | 'danoReparacion' | 'controlFriz' | 'volumen';
  brand?: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  hairType?: string;
  concern?: string;
  brand?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}