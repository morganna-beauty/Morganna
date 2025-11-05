'use client';

import BestSellersCard from './BestSellersCard';
import { useBestSellersSection } from '@/hooks';

export const BestSellersSection = () => {
  const {
    visibleProducts,
    totalPages,
    showPagination,
    handlePageClick,
    getPaginationButtonClass,
    translations,
  } = useBestSellersSection();

  return (
    <section className="flex flex-col items-center px-5 md:px-12 lg:px-16 xl:px-[60px] py-24 gap-16 w-full overflow-x-hidden">
      <h2 className="font-roboto font-medium text-[32px] leading-[40px] text-center text-black w-full max-w-[400px] md:max-w-none">
        {translations.bestSellingProducts}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mx-auto transition-all duration-500">
        {visibleProducts.map((product) => (
          <div key={product.id} className="w-full max-w-[400px] mx-auto">
            <BestSellersCard product={product} />
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={getPaginationButtonClass(index)}
              aria-label={`Ver grupo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
