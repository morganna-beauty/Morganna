import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface BestSellersCardProps {
  product: Product;
}


const BestSellersCard = memo(({ product }: BestSellersCardProps) => {
  return (
    <Link  
      href={`/products/${product.id}`}
      className="flex flex-col justify-center items-start p-0 gap-6 w-[408px] h-[695px] flex-grow cursor-pointer"
    >
      <div className="flex flex-row items-start gap-[10px] w-[408px] h-[611px] bg-[#E8E8E8] rounded-2xl">
        {product.imageSrc && (
          <Image
            src={product.imageSrc}
            alt={product.title}
            className="w-full h-full object-cover rounded-2xl"
            width={408}
            height={611}
          />
        )}
      </div>

      <div className="flex flex-col justify-center items-start p-0 gap-2 h-[60px]">
        <h3 className="font-roboto font-medium text-[22px] leading-[28px] text-center text-black">
          {product.title}
        </h3>

        {product.description && (
          <p className="font-roboto font-medium text-base leading-6 text-center tracking-[0.15px] text-[#808080]">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
});

BestSellersCard.displayName = 'BestSellersCard';

export default BestSellersCard;
