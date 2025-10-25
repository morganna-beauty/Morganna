import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col justify-between items-start w-full max-w-[300px] h-[420px] rounded-2xl overflow-hidden mx-auto sm:mx-0">
      <div className="w-full h-[300px] bg-[#F2F2F2] rounded-2xl overflow-hidden flex justify-center items-center">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          
          </div>
        )}
      </div>

      <div className="flex flex-col justify-start items-start gap-2 p-3 w-full">
        <h3 className="font-roboto font-medium text-lg sm:text-xl text-black w-full line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="font-roboto text-sm text-[#808080] line-clamp-3 w-full">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
