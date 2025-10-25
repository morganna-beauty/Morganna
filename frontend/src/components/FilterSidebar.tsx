import FilterSection from "@/components/FilterSection";
import { useI18n } from "@/hooks";

interface FilterSidebarProps {
  selectedHairType: string;
  selectedConcern: string;
  selectedBrand: string;
  onHairTypeChange: (value: string) => void;
  onConcernChange: (value: string) => void;
  onBrandChange: (value: string) => void;
}

const FilterSidebar = ({
  selectedHairType,
  selectedConcern,
  selectedBrand,
  onHairTypeChange,
  onConcernChange,
  onBrandChange,
}: FilterSidebarProps) => {

    const { t } = useI18n();
  
  const hairTypeOptions = [
    { id: 'liso', label: 'filters.liso' },
    { id: 'ondulado', label: 'filters.ondulado' },
    { id: 'rizado', label: 'filters.rizado' },
    { id: 'afro', label: 'filters.afro' },
  ];

  const concernOptions = [
    { id: 'cabelloSeco', label: 'filters.cabelloSeco' },
    { id: 'danoReparacion', label: 'filters.danoReparacion' },
    { id: 'controlFriz', label: 'filters.controlFriz' },
    { id: 'volumen', label: 'filters.volumen' },
  ];

  const brandOptions = [
    { id: 'marcaA', label: 'filters.marcaA' },
    { id: 'marcaB', label: 'filters.marcaB' },
  ];

  return (
    <aside className="flex flex-col justify-start items-start p-0 gap-6 md:gap-8 w-full lg:w-[169px] bg-white lg:bg-transparent rounded-lg lg:rounded-none lg:p-0">
      <h2 className="font-roboto font-medium text-2xl md:text-[28px] leading-8 md:leading-[36px] text-black">
        {t("filters.filter")}
      </h2>

      <FilterSection
        title="filters.hairType"
        name="hairType"
        options={hairTypeOptions}
        selectedValue={selectedHairType}
        onChange={onHairTypeChange}
      />

      <FilterSection
        title="filters.concern"
        name="concern"
        options={concernOptions}
        selectedValue={selectedConcern}
        onChange={onConcernChange}
      />

      <FilterSection
        title="filters.marca"
        name="brand"
        options={brandOptions}
        selectedValue={selectedBrand}
        onChange={onBrandChange}
      />
    </aside>
  );
};

export default FilterSidebar;