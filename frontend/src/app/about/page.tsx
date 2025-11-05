'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import StarBlog from '@/Icons/StartBlogIcon';
import { useI18n } from '@/hooks/useI18n';

export default function AboutPage() {
  const router = useRouter();
  const { t } = useI18n();

  const handleViewProducts = useCallback(() => {
    router.push('/products');
  }, [router]);

  const handleStartDiagnostic = useCallback(() => {
    router.push('/diagnostic');
  }, [router]);

  const title = useMemo(() => t('about.title'), [t]);
  const description = useMemo(() => t('about.description'), [t]);
  const viewProductsText = useMemo(() => t('about.viewProducts'), [t]);
  const startDiagnosticText = useMemo(() => t('about.startDiagnostic'), [t]);
  const ourStoryText = useMemo(() => t('about.ourStory'), [t]);
  const ourStoryDescription = useMemo(() => t('about.ourStoryText'), [t]);
  const missionAndPhilosophyText = useMemo(() => t('about.missionAndPhilosophy'), [t]);
  const missionText = useMemo(() => t('about.mission'), [t]);
  const missionDescription = useMemo(() => t('about.missionText'), [t]);
  const visionText = useMemo(() => t('about.vision'), [t]);
  const visionDescription = useMemo(() => t('about.visionText'), [t]);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hair_desktop.jpg')",
  }), []);

  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <section className="flex flex-col justify-center items-center px-5 py-8 md:px-12 md:py-12 lg:px-24 lg:py-8 bg-white">
        <div 
          className="flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 py-0 gap-8 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px] h-[634px] rounded-2xl bg-cover bg-center"
          style={backgroundStyle}
        >
          <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[272px] md:max-w-[600px] lg:max-w-[1120px]">
            <h1 className="text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] lg:text-[57px] lg:leading-[64px] font-medium text-center text-white w-full lg:tracking-[-0.25px]">
              {title}
            </h1>
            <p className="text-[28px] leading-[36px] md:text-[26px] md:leading-[34px] lg:text-[28px] lg:leading-[36px] font-normal text-center text-white w-full">
              {description}
            </p>
          </div>

          <div className="flex flex-row items-center gap-4">
            <button 
              onClick={handleViewProducts}
              className="flex justify-center items-center h-12 hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-center items-center px-4 py-[10px] w-full h-10 bg-[#215E6B] rounded-full">
                <span className="font-medium text-sm leading-5 tracking-[0.1px] text-white">
                  {viewProductsText}
                </span>
              </div>
            </button>
            
            <button 
              onClick={handleStartDiagnostic}
              className="flex justify-center items-center w-auto h-12 hover:opacity-90 transition-opacity"
            >
              <div className="flex justify-center items-center px-4 py-[10px] w-full h-10 bg-white rounded-full">
                <span className="font-medium text-sm leading-5 tracking-[0.1px] text-black">
                  {startDiagnosticText}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center px-5 py-8 md:px-12 md:py-16 lg:px-24 lg:py-24 gap-8">
        <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1114px]">
          <h2 className="text-[32px] leading-[40px] font-medium text-center text-black w-full">
            {ourStoryText}
          </h2>
          <p className="text-sm leading-5 md:text-lg md:leading-7 lg:text-[22px] lg:leading-[28px] font-medium md:font-normal text-center text-black w-full tracking-[0.1px] md:tracking-normal">
            {ourStoryDescription}
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center px-5 py-8 md:px-12 md:py-16 lg:px-24 lg:py-24 gap-8 md:gap-12 lg:gap-16 bg-white">
        <h2 className="text-[32px] leading-[40px] font-medium text-center text-black w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px]">
          {missionAndPhilosophyText}
        </h2>

        <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1248px]">
          <div className="flex flex-col items-center p-6 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg flex-1">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <h3 className="text-[22px] leading-[28px] font-medium text-center text-black w-full">
                {missionText}
              </h3>
              <p className="text-base leading-6 font-normal text-center text-[#215E6B] w-full tracking-[0.5px]">
                {missionDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg flex-1">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <h3 className="text-[22px] leading-[28px] font-medium text-center text-black w-full">
                {visionText}
              </h3>
              <p className="text-base leading-6 font-normal text-center text-[#215E6B] w-full tracking-[0.5px]">
                {visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}