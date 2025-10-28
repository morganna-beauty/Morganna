import React, { memo, useCallback, useMemo } from 'react';
import { HairType, Concern, FilterProductsRequest } from '@/types/product';

interface ProductFiltersProps {
  filters: FilterProductsRequest;
  onFiltersChange: (filters: FilterProductsRequest) => void;
  filterOptions: {
    hairTypes: string[];
    concerns: string[];
    brands: string[];
  };
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = memo(
  ({ filters, onFiltersChange, filterOptions, className = '' }) => {
    const handleFilterChange = useCallback(
      (key: keyof FilterProductsRequest, value: string) => {
        onFiltersChange({
          ...filters,
          [key]: value === '' ? undefined : value,
        });
      },
      [filters, onFiltersChange]
    );

    const clearFilters = useCallback(() => {
      onFiltersChange({});
    }, [onFiltersChange]);

    const hasActiveFilters = useMemo(
      () => Object.values(filters).some((value) => value !== undefined && value !== ''),
      [filters]
    );

    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Search */}
          <div className="w-full lg:flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar productos
            </label>

            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="w-full lg:w-48">
            <label htmlFor="hairType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de cabello
            </label>

            <select
              id="hairType"
              value={filters.hairType || ''}
              onChange={(e) => handleFilterChange('hairType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>

              {Object.values(HairType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:w-48">
            <label htmlFor="concern" className="block text-sm font-medium text-gray-700 mb-1">
              Preocupación
            </label>

            <select
              id="concern"
              value={filters.concern || ''}
              onChange={(e) => handleFilterChange('concern', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todas las preocupaciones</option>

              {Object.values(Concern).map((concern) => (
                <option key={concern} value={concern}>
                  {concern === Concern.CABELLO_SECO && 'Cabello Seco'}

                  {concern === Concern.DANO_REPARACION && 'Daño y Reparación'}

                  {concern === Concern.CONTROL_FRIZ && 'Control de Friz'}

                  {concern === Concern.VOLUMEN && 'Volumen'}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="w-full lg:w-48">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>

            <select
              id="brand"
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todas las marcas</option>

              {filterOptions.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Filtros activos:</span>

              {filters.search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Búsqueda: "{filters.search}"
                </span>
              )}

              {filters.hairType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tipo: {filters.hairType.charAt(0).toUpperCase() + filters.hairType.slice(1)} X
                </span>
              )}

              {filters.concern && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Preocupación: {filters.concern}
                </span>
              )}

              {filters.brand && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  Marca: {filters.brand}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProductFilters.displayName = 'ProductFilters';
