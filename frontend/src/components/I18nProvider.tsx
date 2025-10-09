'use client';

import { useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { I18nContext, I18nContextType } from '@/contexts/I18nContext';

import enCommon from '../locales/en/common.json';
import enProduct from '../locales/en/product.json';
import enNavbar from '../locales/en/navbar.json';
import esCommon from '../locales/es/common.json';
import esProduct from '../locales/es/product.json';
import esNavbar from '../locales/es/navbar.json';

export type TranslationsType = {
  [language: string]: {
    [namespace: string]: {
      [key: string]: string | { [nestedKey: string]: string };
    };
  };
};

const translations: TranslationsType = {
  en: {
    common: enCommon,
    product: enProduct,
    navbar: enNavbar,
  },
  es: {
    common: esCommon,
    product: esProduct,
    navbar: esNavbar,
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedLanguage = localStorage.getItem('language') || 'en';

        setLanguage(savedLanguage);
      } catch (error) {
        console.warn('Failed to read language preference from localStorage:', error);
        setLanguage('en');
      }
    } else {
      setLanguage('en');
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split('.');

      const namespace = parts[0];

      const translationKey = parts.slice(1).join('.');

      let value: any =
        translations[language as keyof typeof translations]?.[
          namespace as keyof typeof translations.en
        ];

      const keys = translationKey.split('.');

      for (const k of keys) {
        value = value?.[k];
      }

      return (typeof value === 'string' ? value : key) as string;
    },
    [language]
  );

  const handleSetLanguage = useCallback((lang: string) => {
    setLanguage(lang);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.warn('Failed to save language preference to localStorage:', error);
      }
    }
  }, []);

  const contextValue: I18nContextType = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
    }),
    [language, handleSetLanguage, t]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
