"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  if (!product?.id) return null;

  return (
    <div className="flex flex-col items-start w-full max-w-[300px] h-[420px] rounded-2xl overflow-hidden mx-auto sm:mx-0">
      <Link href={`/products/${product.id}`} className="w-full h-[300px]">
        <div className="bg-[#F2F2F2] w-full h-full rounded-2xl flex justify-center items-center overflow-hidden">
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="text-gray-400 text-sm">Sin imagen</div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-3 w-full">
        <h3 className="font-medium text-lg sm:text-xl text-black w-full line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-sm text-[#808080] line-clamp-3 w-full">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
