'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterProductsRequest, HairType, Concern } from '@/types';
import { useProducts } from './useProducts';

export function useFilteredProducts() {
  const [selectedHairType, setSelectedHairType] = useState<string[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');

  const filters = useMemo(() => {
    const filterRequest: FilterProductsRequest = {};

    // If multiple hair types selected, use first one (backend supports single value)
    if (selectedHairType.length > 0) {
      filterRequest.hairType = selectedHairType[0] as HairType;
    }

    // Concerns support arrays in backend
    if (selectedConcern.length > 0) {
      filterRequest.concern = selectedConcern as Concern[];
    }

    // If multiple brands selected, use first one (backend supports single value)
    if (selectedBrand.length > 0) {
      filterRequest.brand = selectedBrand[0];
    }

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

  const handleSetHairType = useCallback((values: string[]) => setSelectedHairType(values), []);
  const handleSetConcern = useCallback((values: string[]) => setSelectedConcern(values), []);
  const handleSetBrand = useCallback((values: string[]) => setSelectedBrand(values), []);
  const handleSetSortBy = useCallback((value: string) => setSortBy(value), []);

  const clearFilters = useCallback(() => {
    setSelectedHairType([]);
    setSelectedConcern([]);
    setSelectedBrand([]);
  }, []);

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
      clearFilters,
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
      clearFilters,
    ]
  );
}
