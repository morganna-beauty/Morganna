'use client';

import { useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { I18nContext, I18nContextType } from '@/contexts/I18nContext';

import enCommon from '../locales/en/common.json';
import enProduct from '../locales/en/product.json';
import enNavbar from '../locales/en/navbar.json';
import esCommon from '../locales/es/common.json';
import esProduct from '../locales/es/product.json';
import esNavbar from '../locales/es/navbar.json';

type TranslationValue = string | { [key: string]: TranslationValue };

type Namespace = {
  [key: string]: TranslationValue;
};

type TranslationsType = {
  [language: string]: {
    [namespace: string]: Namespace;
  };
};

const TRANSLATIONS: TranslationsType = {
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

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'language';

const getStoredLanguage = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  try {
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Failed to read language preference:', error);

    return DEFAULT_LANGUAGE;
  }
};

const setStoredLanguage = (lang: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    console.log(`Language set to: ${lang}`);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = getStoredLanguage();

    setLanguage(savedLanguage);
    setIsInitialized(true);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const [namespace, ...keyParts] = key.split('.');
      
      if (!namespace || keyParts.length === 0) {
        console.warn(`Invalid translation key format: ${key}`);

        return key;
      }

      const translationKey = keyParts.join('.');
      let value: TranslationValue | undefined = TRANSLATIONS[language]?.[namespace];

      for (const part of translationKey.split('.')) {
        if (typeof value === 'object' && value !== null) {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }

      if (typeof value === 'string') {
        return value;
      }

      console.warn(`Translation not found: ${key}`);

      return key;
    },
    [language]
  );

  const handleSetLanguage = useCallback((lang: string) => {
    if (!TRANSLATIONS[lang]) {
      console.warn(`Language "${lang}" not supported`);
      
      return;
    }

    setLanguage(lang);
    setStoredLanguage(lang);
  }, []);

  const contextValue: I18nContextType = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
    }),
    [language, handleSetLanguage, t]
  );

  if (!isInitialized) {
    return null;
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}