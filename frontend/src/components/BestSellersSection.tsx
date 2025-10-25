'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Product } from '@/types';
import BestSellersCard from './BestSellersCard';

interface Props {
  products: Product[];
}

const BestSellersSection = ({products}: Props) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = products.length - 3;

        return prevIndex >= maxIndex ? 0 : prevIndex + 3;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const visibleProducts = products.slice(currentIndex, currentIndex + 3);

  return (
    <section className="flex flex-col items-center px-5 md:px-12 lg:px-16 xl:px-[60px] py-24 gap-16 w-full overflow-x-hidden">
      <h2 className="font-roboto font-medium text-[32px] leading-[40px] text-center text-black w-full max-w-[400px] md:max-w-none">
        {t('bestsellers.bestSellingProducts')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mx-auto transition-all duration-500">
        {visibleProducts.map((product) => (
          <div key={product.id} className="w-full max-w-[400px] mx-auto">
            <BestSellersCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 3 && (
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index * 3
                  ? 'bg-black w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ver grupo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSellersSection;