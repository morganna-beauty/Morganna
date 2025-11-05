import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion'
import { useI18n } from '@/hooks/useI18n'

interface RecommendationBoxProps {
  text: string
  showFullText: boolean
  onToggleFullText: () => void
  onRestart: () => void
}

const RecommendationBoxComponent: React.FC<RecommendationBoxProps> = ({
  text,
  showFullText,
  onToggleFullText,
  onRestart
}) => {
  const { t } = useI18n()

  const handleToggleFullText = useCallback(() => {
    onToggleFullText();
  }, [onToggleFullText]);

  const handleRestart = useCallback(() => {
    onRestart();
  }, [onRestart]);

  const displayText = useMemo(() => text || t('diagnostic.recommendations.not_found'), [text, t]);
  const toggleButtonText = useMemo(() => 
    showFullText ? t('diagnostic.buttons.see_less') : t('diagnostic.buttons.see_more'),
    [showFullText, t]
  );
  const restartButtonText = useMemo(() => t('diagnostic.buttons.restart'), [t]);

  return (
    <motion.div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl text-center border border-gray-200 flex flex-col items-center">
      <div className="w-full max-h-96 overflow-y-auto mb-6 px-2">
        <motion.p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
          {displayText}
        </motion.p>
      </div>

      <button
        onClick={handleToggleFullText}
        className="mb-4 px-4 py-2 h-10 bg-gray-200 text-black rounded-full text-sm font-medium hover:bg-gray-300 transition-colors min-w-[120px]"
      >
        {toggleButtonText}
      </button>

      <button
        onClick={handleRestart}
        className="px-4 py-2.5 h-10 bg-[#215E6B] text-white rounded-full text-sm font-medium hover:bg-[#1a4d57] transition-colors min-w-[150px]"
      >
        {restartButtonText}
      </button>
    </motion.div>
  )
}

export const RecommendationBox = memo(RecommendationBoxComponent);
RecommendationBox.displayName = 'RecommendationBox';