import { motion } from 'framer-motion'
import { useI18n } from '@/hooks/useI18n'

interface RecommendationBoxProps {
  text: string
  showFullText: boolean
  onToggleFullText: () => void
  onRestart: () => void
}


export const RecommendationBox: React.FC<RecommendationBoxProps> = ({
  text,
  showFullText,
  onToggleFullText,
  onRestart
}) => {
  const { t } = useI18n()

  return (
    <motion.div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl text-center border border-gray-200 flex flex-col items-center">
      <motion.p className="text-gray-700 text-base leading-relaxed mb-6 whitespace-pre-line">
        {text || t('diagnostic.recommendations.not_found')}
      </motion.p>

      <button
        onClick={onToggleFullText}
        className="mb-4 px-4 py-2 h-10 bg-gray-200 text-black rounded-full text-sm font-medium hover:bg-gray-300 transition-colors min-w-[120px]"
      >
        {showFullText ? t('diagnostic.buttons.see_less') : t('diagnostic.buttons.see_more')}
      </button>

      <button
        onClick={onRestart}
        className="px-4 py-2.5 h-10 bg-[#215E6B] text-white rounded-full text-sm font-medium hover:bg-[#1a4d57] transition-colors min-w-[150px]"
      >
        {t('diagnostic.buttons.restart')}
      </button>
    </motion.div>
  )
}
