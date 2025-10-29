import { useI18n } from '@/hooks/useI18n'

interface StepHeaderProps {
  step: number
  selectedCause: string | null
}


export const StepHeader: React.FC<StepHeaderProps> = ({ step }) => {
  const { t } = useI18n()

  const title =
    step === 1 ? t('diagnostic.steps.1') :
    step === 2 ? t('diagnostic.steps.2') :
    step === 2.5 ? t('diagnostic.steps.2_5') :
    t('diagnostic.steps.3')

  const progressText =
    step < 3
      ? step === 2.5
        ? t('diagnostic.steps.progress_process')
        : t('diagnostic.steps.progress').replace('{{step}}', step.toString())
      : t('diagnostic.steps.result')

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full max-w-3xl">
      <h2 className="text-sm md:text-lg lg:text-2xl font-semibold text-center text-black">
        {progressText}
      </h2>
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-center text-black leading-tight">
        {title}
      </h1>
    </div>
  )
}
