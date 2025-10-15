import { CreateProductRequest, Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductRequest) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default ProductFormProps