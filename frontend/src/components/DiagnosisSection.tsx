'use client';

import Star from '@/Icons/Star';
import { useI18n } from '@/hooks/useI18n';

const DiagnosisSection = () => {
  const { t } = useI18n();

  return (
    <section 
      className="flex flex-col items-center px-5 md:px-12 lg:px-[60px] py-[60px] md:py-20 lg:py-24 gap-[10px] lg:gap-16 w-full h-[924px] md:min-h-[500px] lg:h-[424px] bg-cover bg-right md:bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/routine_desktop.png')",
      }}
    >
      <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[400px] md:max-w-[680px] lg:max-w-[834px] h-auto md:h-auto lg:h-[232px]">
        <div className="flex flex-col justify-center items-center gap-4 w-full h-auto md:h-auto lg:h-[152px]">
          <h3 className="font-roboto font-medium text-4xl md:text-5xl lg:text-[57px] leading-[44px] md:leading-tight lg:leading-[64px] tracking-[-0.25px] text-center text-black w-full h-auto md:h-auto lg:h-16 mb-[65px]">
            {t('routine.title')}
          </h3>

          <p className="font-roboto font-normal text-2xl md:text-2xl lg:text-[28px] leading-8 md:leading-9 lg:leading-[36px] text-center text-black w-full h-auto md:h-auto lg:h-[72px] ">
            {t('routine.description')}
          </p>
        </div>

        <button 
          type="button" 
          className="flex flex-row justify-center items-center w-[203px] h-12 hover:opacity-90 transition-opacity relative top-[30px]"
        >
          <div className="flex flex-row justify-center items-center px-4 py-[10px] gap-2 w-[203px] h-10 bg-[#215E6B] rounded-[100px]">
            <Star className="w-5 h-5 text-white flex-none"/>

            <span className="font-roboto font-medium text-sm leading-5 tracking-[0.1px] text-white flex-none">
              {t('routine.button')}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default DiagnosisSection;