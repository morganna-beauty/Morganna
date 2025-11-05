'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useI18n } from './useI18n';
import { useProducts } from './useProducts';

export const useBestSellersSection = () => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products } = useProducts();

  const updateIndex = useCallback(() => {
    // Si hay 3 o menos productos, no rotar
    if (products.length <= 3) return;
    
    setCurrentIndex((prevIndex) => {
      const maxIndex = products.length - 3;
      // Si llegamos al final, volver al inicio
      if (prevIndex >= maxIndex) {
        return 0;
      }
      // Avanzar de 1 en 1 (quitar el primero, agregar uno al final)
      return prevIndex + 1;
    });
  }, [products.length]);

  // Asegurar que currentIndex esté dentro del rango válido
  useEffect(() => {
    if (products.length <= 3) {
      setCurrentIndex(0);
      return;
    }

    const maxIndex = products.length - 3;
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [products.length, currentIndex]);

  useEffect(() => {
    if (products.length <= 3) return;

    const interval = setInterval(updateIndex, 5000);

    return () => clearInterval(interval);
  }, [products.length, updateIndex]);

  const visibleProducts = useMemo(() => {
    // Si hay menos de 3 productos, mostrar todos
    if (products.length <= 3) {
      return products;
    }
    // Si hay 3 o más productos, siempre mostrar exactamente 3
    // Si estamos cerca del final y no hay suficientes productos, volver al inicio
    if (currentIndex + 3 > products.length) {
      // Si quedan menos de 3 productos al final, tomar los últimos 3
      return products.slice(-3);
    }
    return products.slice(currentIndex, currentIndex + 3);
  }, [products, currentIndex]);

  const totalPages = useMemo(
    () => Math.ceil(products.length / 3),
    [products.length]
  );

  const showPagination = useMemo(
    () => products.length > 3,
    [products.length]
  );

  const handlePageClick = useCallback((pageIndex: number) => {
    // Calcular el índice basado en la página (cada página muestra 3 productos)
    setCurrentIndex(pageIndex * 3);
  }, []);

  const getPaginationButtonClass = useCallback((index: number) => {
    // Determinar si esta página está activa (si el currentIndex está dentro del rango de esta página)
    const pageStartIndex = index * 3;
    const pageEndIndex = Math.min(pageStartIndex + 3, products.length);
    const isActive = currentIndex >= pageStartIndex && currentIndex < pageEndIndex;
    
    return `w-2 h-2 rounded-full transition-all ${
      isActive ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'
    }`;
  }, [currentIndex, products.length]);

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