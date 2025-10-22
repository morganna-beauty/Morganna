'use client';

import Star from '@/Icons/Star';
import { useI18n } from '@/hooks/useI18n';

const DiagnosisSection = () => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col justify-center items-center px-5 md:px-12 lg:px-16 xl:px-[60px] py-[60px] md:py-20 lg:py-24 gap-[10px] w-full h-[924px] md:min-h-[800px] lg:min-h-[924px] bg-[#E8E8E8]">
      <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[400px] md:max-w-[680px] lg:max-w-[834px]">
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h3 className="font-roboto font-medium text-4xl md:text-5xl lg:text-[57px] leading-[44px] md:leading-tight lg:leading-[64px] tracking-[-0.25px] text-center text-black w-full">
            {t('routine.title')}
          </h3>

          <p className="font-roboto font-normal text-2xl md:text-2xl lg:text-[28px] leading-[32px] md:leading-relaxed lg:leading-[36px] text-center text-black w-full">
            {t('routine.description')}
          </p>
        </div>

        <button type="button" className="flex flex-row justify-center items-center w-[203px] h-[48px]">
          <div className="flex flex-row justify-center items-center px-4 py-[10px] gap-2 w-[203px] h-[40px] bg-[#215E6B] rounded-[100px] hover:opacity-90 transition-opacity">
            <Star className="w-5 h-5 text-white"/>

            <span className="font-roboto font-medium text-sm leading-5 tracking-[0.1px] text-white">
              {t('routine.button')}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default DiagnosisSection;