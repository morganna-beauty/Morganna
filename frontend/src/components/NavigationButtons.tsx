import { memo, useCallback, useMemo } from 'react';
import { useI18n } from '@/hooks/useI18n'

interface NavigationButtonsProps {
  step: number
  onBack: () => void
  onNext: () => void
}

const NavigationButtonsComponent: React.FC<NavigationButtonsProps> = ({
  step,
  onBack,
  onNext
}) => {
  const { t } = useI18n()

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const backText = useMemo(() => t('diagnostic.buttons.back'), [t]);
  const nextText = useMemo(() => t('diagnostic.buttons.next'), [t]);

  const showBackButton = useMemo(() => step > 1 && step < 3, [step]);
  const showNextButton = useMemo(() => step < 3, [step]);

  return (
    <div className="flex gap-3 mt-4">
      {showBackButton && (
        <button
          onClick={handleBack}
          className="px-4 py-2.5 h-10 bg-gray-200 text-black rounded-full text-sm font-medium hover:bg-gray-300 transition-colors min-w-[92px]"
        >
          {backText}
        </button>
      )}

      {showNextButton && (
        <button
          onClick={handleNext}
          className="px-4 py-2.5 h-10 bg-[#215E6B] text-white rounded-full text-sm font-medium hover:bg-[#1a4d57] transition-colors min-w-[92px]"
        >
          {nextText}
        </button>
      )}
    </div>
  )
}

export const NavigationButtons = memo(NavigationButtonsComponent);
NavigationButtons.displayName = 'NavigationButtons';
