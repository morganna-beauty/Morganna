'use client'

export const ProductImage = ({ src, title }: { src: string; title: string }) => (
  <div className="flex flex-row items-start w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden lg:w-[370px] lg:h-[370px]">
    <img
      src={src || '/placeholder.png'}
      alt={title}
      className="w-full h-full object-cover"
    />
  </div>
);
