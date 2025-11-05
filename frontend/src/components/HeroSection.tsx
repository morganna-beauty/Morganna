'use client';

import { memo, useMemo } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { StartDiagnosticButton } from './StartDiagnosticButton';

const HeroSectionComponent = () => {
  const { t } = useI18n();

  const title = useMemo(() => t('hero.title'), [t]);
  const description = useMemo(() => t('hero.description'), [t]);
  const backgroundStyle = useMemo(() => ({ backgroundImage: "url('/hero_desktop.png')" }), []);

  return (
    <section
      className="flex flex-col justify-center items-center px-5 md:px-12 lg:px-16 xl:px-[60px] py-[60px] md:py-20 lg:py-24 gap-[10px] w-full h-[924px] md:min-h-[800px] lg:min-h-[924px] bg-cover bg-center bg-no-repeat"
      style={backgroundStyle}
    >
      <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[400px] md:max-w-[540px] lg:max-w-[660px]">
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h1 className="font-roboto font-medium text-4xl md:text-5xl lg:text-[57px] leading-[44px] md:leading-tight lg:leading-[64px] tracking-[-0.25px] text-center text-black w-full">
            {title}
          </h1>

          <p className="font-roboto font-normal text-2xl md:text-2xl lg:text-[28px] leading-[32px] md:leading-relaxed lg:leading-[36px] text-center text-black w-full">
            {description}
          </p>
        </div>

        <StartDiagnosticButton textKey="hero.button" className="w-[203px] h-[48px]" buttonClassName="w-[203px] h-[40px]" />
      </div>
    </section>
  );
};

export const HeroSection = memo(HeroSectionComponent);
HeroSection.displayName = 'HeroSection';
