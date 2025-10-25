import { useState, useMemo } from 'react';
import { Product } from '@/types';

export function useFilteredProducts(products: Product[]) {
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedHairType && product.hairType !== selectedHairType) return false;
      if (selectedConcern && product.concern !== selectedConcern) return false;
      if (selectedBrand && product.brand !== selectedBrand) return false;

      return true;
    });
  }, [products, selectedHairType, selectedConcern, selectedBrand]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'priceLowToHigh':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popularity':
        return sorted.sort((a, b) => b.stock - a.stock);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  return {
    filteredProducts,
    sortedProducts,

    selectedHairType,
    selectedConcern,
    selectedBrand,
    sortBy,

    setSelectedHairType,
    setSelectedConcern,
    setSelectedBrand,
    setSortBy,
  };
}
