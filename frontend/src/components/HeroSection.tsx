'use client';

import { useI18n } from '@/hooks/useI18n';
import Star from '@/Icons/Star';

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 w-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[924px] bg-[#E8E8E8]">
      <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 w-full max-w-[90%] sm:max-w-[540px] md:max-w-[660px]">
        <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 w-full">
          <h1 className="font-roboto font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[57px] leading-tight sm:leading-tight md:leading-[64px] tracking-[-0.25px] text-center text-black">
            {t('hero.title')}
          </h1>

          <p className="font-roboto font-normal text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-relaxed sm:leading-relaxed md:leading-[36px] text-center text-black">
            {t('hero.description')}
          </p>
        </div>

        <button type="button" className="flex flex-row justify-center items-center w-full sm:w-[203px] max-w-[203px] h-[48px]">
          <div className="flex flex-row justify-center items-center px-4 py-[10px] gap-2 w-full h-[40px] bg-[#215E6B] rounded-[100px] hover:opacity-90 transition-opacity">
            <Star className="w-5 h-5"/>

            <span className="font-roboto font-medium text-sm leading-5 tracking-[0.1px] text-white">
              {t('hero.button')}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;