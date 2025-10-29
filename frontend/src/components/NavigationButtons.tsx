import { useI18n } from '@/hooks/useI18n'

interface NavigationButtonsProps {
  step: number
  onBack: () => void
  onNext: () => void
}


export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  step,
  onBack,
  onNext
}) => {
  const { t } = useI18n()

  return (
    <div className="flex gap-3 mt-4">
      {step > 1 && step < 3 && (
        <button
          onClick={onBack}
          className="px-4 py-2.5 h-10 bg-gray-200 text-black rounded-full text-sm font-medium hover:bg-gray-300 transition-colors min-w-[92px]"
        >
          {t('diagnostic.buttons.back')}
        </button>
      )}

      {step < 3 && (
        <button
          onClick={onNext}
          className="px-4 py-2.5 h-10 bg-[#215E6B] text-white rounded-full text-sm font-medium hover:bg-[#1a4d57] transition-colors min-w-[92px]"
        >
          {t('diagnostic.buttons.next')}
        </button>
      )}
    </div>
  )
}
