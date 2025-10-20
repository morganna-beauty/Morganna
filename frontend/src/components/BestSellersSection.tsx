'use client';

import ProductCard from '@/components/ProductCard';
import PRODUCTS from '@/data/Products';
import { useI18n } from '@/hooks/useI18n';

const BestSellersSection = () => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-[60px] py-24 gap-16 w-full">
      <h2 className="font-roboto font-medium text-[32px] leading-[40px] text-center text-black w-full">
        {t('bestsellers.bestSellingProducts')}
      </h2>

      <div className="flex flex-row items-start gap-12 w-full max-w-[1320px]">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} title={product.title} description={product.description} />
        ))}
      </div>
    </section>
  );
};

export default BestSellersSection;
