import { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterProductsRequest, SortBy, Order, HairType, Concern } from '@/types';
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
        // Default case - no sorting parameters (backend will use createdAt DESC)
        break;
    }

    return filterRequest;
  }, [selectedHairType, selectedConcern, selectedBrand, sortBy]);

  // Use the products hook with dynamic filters
  const { products, loading, error, filterOptions, updateFilters } = useProducts();

  // Update filters whenever they change
  useEffect(() => {
    updateFilters(filters);
  }, [filters, updateFilters]);

  return {
    products,
    loading,
    error,
    filterOptions,

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
