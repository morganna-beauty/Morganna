export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
