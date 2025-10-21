'use client';

import ProductCard from '@/components/ProductCard';
import PRODUCTS from '@/data/Products';
import { useI18n } from '@/hooks/useI18n';

const BestSellersSection = () => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[60px] py-12 sm:py-16 md:py-20 lg:py-24 gap-8 sm:gap-12 md:gap-16 w-full">
      <h2 className="font-roboto font-medium text-2xl sm:text-3xl md:text-[32px] leading-tight sm:leading-[40px] text-center text-black w-full">
        {t('bestsellers.bestSellingProducts')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full max-w-[1320px]">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} title={product.title} description={product.description} />
        ))}
      </div>
    </section>
  );
};

export default BestSellersSection;