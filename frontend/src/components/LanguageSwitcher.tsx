'use client';

import { useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
    },
    [setLanguage]
  );

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => handleLanguageChange('es')}
        aria-pressed={language === 'es'}
        aria-label="Switch to Spanish"
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ES
      </button>
    </div>
  );
}
