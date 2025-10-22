'use client';

import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.json';
import { useI18n } from '@/hooks/useI18n';

const BestSellersSection = () => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center px-5 md:px-12 lg:px-16 xl:px-[60px] py-24 gap-16 w-full overflow-x-hidden">
      <h2 className="font-roboto font-medium text-[32px] leading-[40px] text-center text-black w-full max-w-[400px] md:max-w-none">
        {t('bestsellers.bestSellingProducts')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mx-auto">
        {productsData.slice(0, 3).map((product) => (
          <div key={product.id} className="w-full max-w-[400px] mx-auto">
            <ProductCard
              title={product.title}
              description={product.description}
              imageSrc={product.imageSrc}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellersSection;