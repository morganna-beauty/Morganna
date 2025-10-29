interface OptionSelectorProps<T extends string> {
  options: T[]
  selectedOption: T | null
  onSelect: (option: T) => void
}

export const OptionSelector = <T extends string>({
  options,
  selectedOption,
  onSelect,
}: OptionSelectorProps<T>) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-colors
            ${selectedOption === option
              ? 'bg-[#215E6B] text-white border-[#215E6B]'
              : 'bg-white text-[#49454F] border-[#CAC4D0] hover:bg-gray-50'}`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
