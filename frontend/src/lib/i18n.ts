import { GetStaticProps, GetStaticPropsContext } from 'next';
import fs from 'fs';
import path from 'path';

export type SupportedLocale = 'en' | 'es';

export type SupportedNamespace =
  | 'common'
  | 'product'
  | 'navbar'
  | 'hero'
  | 'bestsellers'
  | 'routine'
  | 'footer'
  | 'filters'
  | 'cart'
  | 'upload';

export type TranslationValue = string | { [key: string]: TranslationValue };

export interface TranslationNamespace {
  [key: string]: TranslationValue;
}

export interface LocaleTranslations {
  [namespace: string]: TranslationNamespace;
}

export interface ServerSideTranslations {
  _nextI18Next: {
    initialLocale: string;
    ns: string[];
    initialI18nStore: {
      [locale: string]: LocaleTranslations;
    };
  };
}

export type TranslationLoader = (
  locale: SupportedLocale,
  namespaces: SupportedNamespace[]
) => Promise<LocaleTranslations>;

export type AdditionalPropsFunction = (
  context: GetStaticPropsContext
) => Promise<Record<string, any>>;

export type LanguageSetter = (lang: SupportedLocale) => void;

export interface ClientTranslations {
  [namespace: string]: TranslationNamespace;
}

const loadTranslations: TranslationLoader = async (
  locale: SupportedLocale,
  namespaces: SupportedNamespace[]
): Promise<LocaleTranslations> => {
  const translations: LocaleTranslations = {};

  for (const namespace of namespaces) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'locales', locale, `${namespace}.json`);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        translations[namespace] = JSON.parse(fileContent);
      } else {
        console.warn(`Translation file not found: ${filePath}`);
        translations[namespace] = {};
      }
    } catch (error) {
      console.error(`Error loading translation file for ${locale}/${namespace}:`, error);
      translations[namespace] = {};
    }
  }

  return translations;
};

export const getServerSideTranslations = async (
  locale: string,
  namespaces: SupportedNamespace[] = ['common']
): Promise<ServerSideTranslations> => {
  const supportedLocales: SupportedLocale[] = ['en', 'es'];
  const validLocale: SupportedLocale = supportedLocales.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : 'en';

  const translations = await loadTranslations(validLocale, namespaces);

  return {
    _nextI18Next: {
      initialLocale: validLocale,
      ns: namespaces,
      initialI18nStore: {
        [validLocale]: translations,
      },
    },
  };
};

export const withTranslations = (
  namespaces: SupportedNamespace[] = ['common'],
  additionalProps?: AdditionalPropsFunction
) => {
  const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || 'en';

    const translations = await getServerSideTranslations(locale, namespaces);

    let additionalData = {};

    if (additionalProps) {
      additionalData = await additionalProps(context);
    }

    return {
      props: {
        ...translations,
        ...additionalData,
      },
    };
  };

  return getStaticProps;
};

export const switchLanguage = (setLanguage: LanguageSetter, newLocale: SupportedLocale): void => {
  setLanguage(newLocale);
};

export const getAvailableLocales = (): SupportedLocale[] => ['en', 'es'];

export const isSupportedLocale = (locale: string): locale is SupportedLocale =>
  getAvailableLocales().includes(locale as SupportedLocale);

export const loadClientTranslations = async (
  locale: SupportedLocale,
  namespaces: SupportedNamespace[]
): Promise<ClientTranslations> => {
  const translations: ClientTranslations = {};

  for (const namespace of namespaces) {
    try {
      const translationModule = await import(`../locales/${locale}/${namespace}.json`);

      translations[namespace] = translationModule.default || translationModule;
    } catch (error) {
      console.warn(`Failed to load client translation: ${locale}/${namespace}`, error);
      translations[namespace] = {};
    }
  }

  return translations;
};
