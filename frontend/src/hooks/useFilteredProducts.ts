'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterProductsRequest, HairType, Concern } from '@/types';
import { useProducts } from './useProducts';

export function useFilteredProducts() {
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filters = useMemo(() => {
    const filterRequest: FilterProductsRequest = {};

    if (selectedHairType) filterRequest.hairType = selectedHairType as HairType;
    if (selectedConcern) filterRequest.concern = selectedConcern as Concern;
    if (selectedBrand) filterRequest.brand = selectedBrand;

    switch (sortBy) {
      case 'priceLowToHigh':
        filterRequest.sortBy = 'price' as any;
        filterRequest.order = 'ASC' as any;
        break;
      case 'priceHighToLow':
        filterRequest.sortBy = 'price' as any;
        filterRequest.order = 'DESC' as any;
        break;
      case 'popularityDesc':
        filterRequest.sortBy = 'popularity' as any;
        filterRequest.order = 'DESC' as any;
        break;
      case 'popularityAsc':
        filterRequest.sortBy = 'popularity' as any;
        filterRequest.order = 'ASC' as any;
        break;
      default:
        break;
    }

    return filterRequest;
  }, [selectedHairType, selectedConcern, selectedBrand, sortBy]);

  const { products, loading, error, filterOptions, updateFilters } = useProducts();

  useEffect(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  const handleSetHairType = useCallback((value: string) => setSelectedHairType(value), []);
  const handleSetConcern = useCallback((value: string) => setSelectedConcern(value), []);
  const handleSetBrand = useCallback((value: string) => setSelectedBrand(value), []);
  const handleSetSortBy = useCallback((value: string) => setSortBy(value), []);

  return useMemo(
    () => ({
      products,
      loading,
      error,
      filterOptions,
      selectedHairType,
      selectedConcern,
      selectedBrand,
      sortBy,
      setSelectedHairType: handleSetHairType,
      setSelectedConcern: handleSetConcern,
      setSelectedBrand: handleSetBrand,
      setSortBy: handleSetSortBy,
    }),
    [
      products,
      loading,
      error,
      filterOptions,
      selectedHairType,
      selectedConcern,
      selectedBrand,
      sortBy,
      handleSetHairType,
      handleSetConcern,
      handleSetBrand,
      handleSetSortBy,
    ]
  );
}
