'use client';

import { useContext, useMemo } from 'react';
import { I18nContext } from '@/contexts';

export const useI18n = () => {
  const context = useContext(I18nContext);

  return useMemo(() => {
    if (!context) {
      throw new Error('useI18n must be used within an I18nProvider');
    }

    return context;
  }, [context]);
};
