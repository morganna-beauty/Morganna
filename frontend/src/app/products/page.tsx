'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/hooks/useI18n';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';

function ProductsPage() {
  const { t } = useI18n();
  const {
    products,
    selectedHairType,
    selectedConcern,
    selectedBrand,
    sortBy,
    setSelectedHairType,
    setSelectedConcern,
    setSelectedBrand,
    setSortBy,
  } = useFilteredProducts();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  return (
    <section className="relative flex flex-col lg:flex-row justify-start lg:justify-between items-start px-4 sm:px-6 lg:px-[60px] pt-8 md:pt-12 lg:pt-[60px] pb-8 md:pb-12 lg:pb-[60px] gap-6 md:gap-8 w-full min-h-screen max-w-[1440px] mx-auto">
      <div className="hidden lg:block">
        <FilterSidebar
          selectedHairType={selectedHairType}
          selectedConcern={selectedConcern}
          selectedBrand={selectedBrand}
          onHairTypeChange={setSelectedHairType}
          onConcernChange={setSelectedConcern}
          onBrandChange={setSelectedBrand}
        />
      </div>

      <ProductGrid
        products={products}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseFilters}
            />

            <motion.aside
              className="fixed top-0 left-0 h-full w-[85%] sm:w-[360px] bg-white z-50 shadow-lg overflow-y-auto p-6"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-black">{t('common.filters')}</h2>

                <button
                  onClick={handleCloseFilters}
                  className="text-sm text-gray-500 hover:text-black transition"
                >
                  {t('filters.closeFilters')}
                </button>
              </div>

              <FilterSidebar
                selectedHairType={selectedHairType}
                selectedConcern={selectedConcern}
                selectedBrand={selectedBrand}
                onHairTypeChange={setSelectedHairType}
                onConcernChange={setSelectedConcern}
                onBrandChange={setSelectedBrand}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProductsPage;
