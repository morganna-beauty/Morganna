'use client';

import { memo, useMemo } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { StartDiagnosticButton } from './StartDiagnosticButton';

const DiagnosisSectionComponent = () => {
  const { t } = useI18n();

  const title = useMemo(() => t('routine.title'), [t]);
  const description = useMemo(() => t('routine.description'), [t]);
  const backgroundStyle = useMemo(() => ({ backgroundImage: "url('/routine_desktop.png')" }), []);

  return (
    <section
      className="flex flex-col items-center px-5 md:px-12 lg:px-[60px] py-[60px] md:py-20 lg:py-24 gap-[10px] lg:gap-16 w-full h-[924px] md:min-h-[500px] lg:h-[424px] bg-cover bg-right md:bg-center bg-no-repeat"
      style={backgroundStyle}
    >
      <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[400px] md:max-w-[680px] lg:max-w-[834px] h-auto md:h-auto lg:h-[232px]">
        <div className="flex flex-col justify-center items-center gap-4 w-full h-auto md:h-auto lg:h-[152px]">
          <h3 className="font-roboto font-medium text-4xl md:text-5xl lg:text-[57px] leading-[44px] md:leading-tight lg:leading-[64px] tracking-[-0.25px] text-center text-black w-full h-auto md:h-auto lg:h-16 mb-[65px]">
            {title}
          </h3>

          <p className="font-roboto font-normal text-2xl md:text-2xl lg:text-[28px] leading-8 md:leading-9 lg:leading-[36px] text-center text-black w-full h-auto md:h-auto lg:h-[72px] ">
            {description}
          </p>
        </div>

        <StartDiagnosticButton className="relative top-[30px]" />
      </div>
    </section>
  );
};

export const DiagnosisSection = memo(DiagnosisSectionComponent);
DiagnosisSection.displayName = 'DiagnosisSection';
