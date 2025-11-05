'use client'

import { memo, useMemo } from 'react';

interface ProductImageProps {
  src: string;
  title: string;
}

const ProductImageComponent = ({ src, title }: ProductImageProps) => {
  const imageSrc = useMemo(() => src || '/placeholder.png', [src]);
  
  return (
    <div className="flex flex-row items-start w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden lg:w-[370px] lg:h-[370px]">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export const ProductImage = memo(ProductImageComponent);
ProductImage.displayName = 'ProductImage';
