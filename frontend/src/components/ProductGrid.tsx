import { useMemo, useCallback } from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import FilterIcon from "@/Icons/FilterIcon";
import SortIcon from "@/Icons/SortIcon";
import { useI18n } from "@/hooks";

interface ProductGridProps {
  products: Product[];
  sortBy: string;
  onSortChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const ProductGrid = ({
  products = [],
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
}: ProductGridProps) => {
  const { t } = useI18n();

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value);
    },
    [onSortChange]
  );

  const handleFocusSort = useCallback(() => {
    const select = document.getElementById("sortSelect");

    if (select) select.focus();
  }, []);

  const productList = useMemo(
    () =>
      products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <div className="w-full text-center py-12">
          <p className="font-roboto text-lg text-gray-500">{t("filters.notFound")}</p>
        </div>
      ),
    [products, t]
  );

  return (
    <div className="flex flex-col items-start gap-6 md:gap-8 w-full lg:w-[948px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 w-full">
        <div className="flex flex-row justify-between items-center w-full sm:w-auto">
          <h2 className="font-roboto font-medium text-2xl sm:text-[28px] lg:text-[32px] leading-8 sm:leading-9 lg:leading-10 text-black">
            {t("filters.title")}
          </h2>

          <div className="flex sm:hidden flex-row items-center gap-3">
            <button
              onClick={onToggleFilters}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
              <FilterIcon className="w-6 h-6" />
            </button>

            <button
              onClick={handleFocusSort}
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
              <SortIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <button
          onClick={onToggleFilters}
          className="sm:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
          title="Mostrar filtros"
        >
          <FilterIcon className="w-5 h-5 text-[#808080]" />
        </button>

        <div className="hidden sm:flex flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onToggleFilters}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
            title="Mostrar filtros"
          >
            <FilterIcon className="w-5 h-5 text-[#808080]" />
          </button>

          <span className="font-roboto font-medium text-xs sm:text-sm leading-5 tracking-[0.1px] text-[#808080] whitespace-nowrap flex items-center gap-2">
            {t("filters.orderBy")}
          </span>

          <select
            id="sortSelect"
            value={sortBy}
            onChange={handleSortChange}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-3 w-full sm:w-[204px] h-10 sm:h-12 border border-[#757575] rounded-full font-roboto font-medium text-xs sm:text-sm leading-5 tracking-[0.1px] text-black cursor-pointer bg-white"
          >
            <option value="default">Recomendados</option>

            <option value="priceLowToHigh">Precio: Bajo a Alto</option>

            <option value="priceHighToLow">Precio: Alto a Bajo</option>

            <option value="popularity">Popularidad</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start justify-center sm:justify-start content-start gap-6 w-full">
        {productList}
      </div>
    </div>
  );
};

export default ProductGrid;
