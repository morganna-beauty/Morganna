import { useMemo, memo } from 'react';
import FilterSection from '@/components/FilterSection';
import { useI18n } from '@/hooks';

interface FilterSidebarProps {
  selectedHairType: string[];
  selectedConcern: string[];
  selectedBrand: string[];
  onHairTypeChange: (values: string[]) => void;
  onConcernChange: (values: string[]) => void;
  onBrandChange: (values: string[]) => void;
  onClearFilters: () => void;
}

const FilterSidebar = memo(
  ({
    selectedHairType,
    selectedConcern,
    selectedBrand,
    onHairTypeChange,
    onConcernChange,
    onBrandChange,
    onClearFilters,
  }: FilterSidebarProps) => {
    const { t } = useI18n();

    const hairTypeOptions = useMemo(
      () => [
        { id: 'liso', label: 'filters.liso' },
        { id: 'ondulado', label: 'filters.ondulado' },
        { id: 'rizado', label: 'filters.rizado' },
        { id: 'afro', label: 'filters.afro' },
      ],
      []
    );

    const concernOptions = useMemo(
      () => [
        { id: 'cabelloSeco', label: 'filters.cabelloSeco' },
        { id: 'danoReparacion', label: 'filters.danoReparacion' },
        { id: 'controlFriz', label: 'filters.controlFriz' },
        { id: 'volumen', label: 'filters.volumen' },
      ],
      []
    );

    const brandOptions = useMemo(
      () => [
        { id: 'Hija', label: 'filters.marcaA' },
        { id: 'marcaB', label: 'filters.marcaB' },
      ],
      []
    );

    const hasActiveFilters = useMemo(
      () =>
        selectedHairType.length > 0 ||
        selectedConcern.length > 0 ||
        selectedBrand.length > 0,
      [selectedHairType, selectedConcern, selectedBrand]
    );

    return (
      <aside className="flex flex-col justify-start items-start p-0 gap-6 md:gap-8 w-full lg:w-[169px] bg-white lg:bg-transparent rounded-lg lg:rounded-none lg:p-0">
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="font-roboto font-medium text-2xl md:text-[28px] leading-8 md:leading-[36px] text-black">
            {t('filters.filter')}
          </h2>
        </div>

        <FilterSection
          title="filters.hairType"
          name="hairType"
          options={hairTypeOptions}
          selectedValues={selectedHairType}
          onChange={onHairTypeChange}
          multiple={false}
        />

        <FilterSection
          title="filters.concern"
          name="concern"
          options={concernOptions}
          selectedValues={selectedConcern}
          onChange={onConcernChange}
        />

        <FilterSection
          title="filters.marca"
          name="brand"
          options={brandOptions}
          selectedValues={selectedBrand}
          onChange={onBrandChange}
        />

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2.5 md:py-3 bg-[#215E6B] hover:bg-[#1a4a54] text-white font-roboto font-medium text-sm md:text-base rounded-[100px] shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#215E6B] focus:ring-offset-2 active:scale-[0.98]"
          >
            {t('filters.clearFilters')}
          </button>
        )}
      </aside>
    );
  }
);

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
