'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useI18n } from './useI18n';
import { useProducts } from './useProducts';

export const useBestSellersSection = () => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products } = useProducts();

  const updateIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = products.length - 3;

      return prevIndex >= maxIndex ? 0 : prevIndex + 3;
    });
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 3) return;

    const interval = setInterval(updateIndex, 5000);

    return () => clearInterval(interval);
  }, [products.length, updateIndex]);

  const visibleProducts = useMemo(
    () => products.slice(currentIndex, currentIndex + 3),
    [products, currentIndex]
  );

  const totalPages = useMemo(
    () => Math.ceil(products.length / 3),
    [products.length]
  );

  const showPagination = useMemo(
    () => products.length > 3,
    [products.length]
  );

  const handlePageClick = useCallback((pageIndex: number) => {
    setCurrentIndex(pageIndex * 3);
  }, []);

  const getPaginationButtonClass = useCallback((index: number) => {
    return `w-2 h-2 rounded-full transition-all ${
      currentIndex === index * 3 ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'
    }`;
  }, [currentIndex]);

  const translations = useMemo(() => ({
    bestSellingProducts: t('bestsellers.bestSellingProducts'),
  }), [t]);

  return {
    currentIndex,
    visibleProducts,
    totalPages,
    showPagination,
    handlePageClick,
    getPaginationButtonClass,
    translations,
  };
};