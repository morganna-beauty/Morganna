export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  imageSrc?: string;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  stock?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
