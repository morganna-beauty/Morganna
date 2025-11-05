import { useMemo, useCallback, memo } from 'react';
import { useI18n } from '@/hooks';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  name: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
}

const FilterSection = memo(
  ({ title, name, options, selectedValues, onChange, multiple = true }: FilterSectionProps) => {
    const { t } = useI18n();

    const handleChange = useCallback(
      (optionId: string) => {
        if (multiple) {
          // Selección múltiple: toggle
          const newValues = selectedValues.includes(optionId)
            ? selectedValues.filter((id) => id !== optionId)
            : [...selectedValues, optionId];

          onChange(newValues);
        } else {
          onChange([optionId]);
        }
      },
      [selectedValues, onChange, multiple]
    );

    const optionList = useMemo(
      () =>
        options.map((option) => (
          <li key={option.id} className="flex flex-row items-center p-0 gap-2 min-h-[24px] w-full">
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              id={option.id}
              value={option.id}
              checked={selectedValues.includes(option.id)}
              onChange={() => handleChange(option.id)}
              className="w-5 h-5 md:w-6 md:h-6 cursor-pointer flex-shrink-0 rounded-full border-2 appearance-none transition-all duration-200 focus:ring-2 focus:ring-[#215E6B] focus:ring-offset-1"
              style={{
                borderColor: selectedValues.includes(option.id) ? '#215E6B' : '#CAC4D0',
                backgroundColor: selectedValues.includes(option.id) ? '#215E6B' : 'transparent',
              }}
            />

            <label
              htmlFor={option.id}
              className="font-roboto font-normal text-sm md:text-base leading-5 md:leading-6 tracking-[0.5px] text-black cursor-pointer"
            >
              {t(option.label)}
            </label>
          </li>
        )),
      [options, multiple, name, selectedValues, t, handleChange]
    );

    return (
      <div className="flex flex-col justify-center items-start p-0 gap-3 md:gap-4 w-full">
        <h3 className="font-roboto font-normal text-xl md:text-2xl leading-7 md:leading-8 text-black">
          {t(title)}
        </h3>

        <ul className="flex flex-col items-start p-0 gap-2 md:gap-3 w-full">{optionList}</ul>
      </div>
    );
  }
);

FilterSection.displayName = 'FilterSection';

export default FilterSection;
