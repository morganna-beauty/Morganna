import { createContext } from 'react';

export interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);
