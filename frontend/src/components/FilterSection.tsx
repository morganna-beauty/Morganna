import { useI18n } from "@/hooks";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  name: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const FilterSection = ({
  title,
  name,
  options,
  selectedValue,
  onChange,
}: FilterSectionProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col justify-center items-start p-0 gap-3 md:gap-4 w-full">
      <h3 className="font-roboto font-normal text-xl md:text-2xl leading-7 md:leading-8 text-black">
        {t(title)}
      </h3>
      
      <ul className="flex flex-col items-start p-0 gap-2 md:gap-3 w-full">
        {options.map((option) => (
          <li key={option.id} className="flex flex-row items-center p-0 gap-2 min-h-[24px] w-full">
            <input 
              type="radio" 
              name={name}
              id={option.id}
              value={option.id}
              checked={selectedValue === option.id}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex-shrink-0" 
            />
            
            <label 
              htmlFor={option.id} 
              className="font-roboto font-normal text-sm md:text-base leading-5 md:leading-6 tracking-[0.5px] text-black cursor-pointer"
            >
              {t(option.label)}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterSection;