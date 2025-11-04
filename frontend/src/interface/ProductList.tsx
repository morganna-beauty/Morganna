import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export default ProductListProps