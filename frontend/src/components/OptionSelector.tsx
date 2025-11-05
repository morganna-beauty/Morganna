interface OptionSelectorProps<T extends string> {
  options: T[]
  selectedOption: T | null
  selectedOptions?: T[]
  onSelect: (option: T) => void
  multiple?: boolean
}

export const OptionSelector = <T extends string>({
  options,
  selectedOption,
  selectedOptions,
  onSelect,
  multiple = false,
}: OptionSelectorProps<T>) => {
  const isSelected = (option: T) => {
    if (multiple && selectedOptions) {
      return selectedOptions.includes(option);
    }
    
    return selectedOption === option;
  };

  const handleClick = (option: T) => {
    onSelect(option);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-colors
            ${isSelected(option)
              ? 'bg-[#215E6B] text-white border-[#215E6B]'
              : 'bg-white text-[#49454F] border-[#CAC4D0] hover:bg-gray-50'}`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
