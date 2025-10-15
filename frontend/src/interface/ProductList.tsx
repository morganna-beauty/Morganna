import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

export default ProductListProps