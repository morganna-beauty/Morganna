import { GetStaticProps } from 'next';

export const getServerSideTranslations = async (
  locale: string,
  namespaces: string[] = ['common']
): Promise<any> => {
  return {};
};

export const withTranslations = (
  namespaces: string[] = ['common'],
  additionalProps?: (context: any) => Promise<any>
) => {
  const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || 'en';

    const translations = {};

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

export const switchLanguage = (setLanguage: (lang: string) => void, newLocale: string) => {
  setLanguage(newLocale);
};
