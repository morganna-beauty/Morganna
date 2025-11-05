'use client';

import StarBlog from "@/Icons/StartBlogIcon";
import { useI18n, useProducts } from '@/hooks';
import BestSellersCard from '@/components/BestSellersCard';
import { useMemo } from 'react';
import Star from "@/Icons/Star";
import { Concern } from "@/types";

export default function BlogPage() {
  const { products } = useProducts();
  const { t } = useI18n();

  const recommendedProducts = useMemo(() => {
    return products.filter(product => 
      product.concern && Array.isArray(product.concern) && 
      product.concern.some(concern => concern === Concern.CABELLO_SECO || concern === Concern.DANO_REPARACION)
    ).slice(0, 3);
  }, [products]);

  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      {/* Main Container */}
      <div className="flex flex-col items-center px-5 py-8 gap-8 md:px-12 md:py-12 lg:px-[60px] lg:py-[60px]">
        
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-2 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1012px]">
          <h1 className="text-[28px] leading-[36px] md:text-[30px] md:leading-[38px] lg:text-[32px] lg:leading-[40px] font-medium text-center text-black w-full">
            Resultados de tu diagnóstico capilar
          </h1>
          <p className="text-sm leading-5 md:text-lg md:leading-6 lg:text-[28px] lg:leading-[36px] font-semibold md:font-normal text-center text-gray-500 w-full tracking-[0.1px] lg:tracking-normal">
            Basado en tus respuestas, hemos identificado las siguientes necesidades para tu cabello:
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1114px]">
          <div className="flex flex-row items-center p-2 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <h2 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                Hidratación profunda
              </h2>
              <p className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-500">
                Cabello seco y dañado
              </p>
            </div>
          </div>

          {/* Recommendation 2 */}
          <div className="flex flex-row items-center p-2 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <h2 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                Reparación y nutrición
              </h2>
              <p className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-500">
                Puntas abiertas y falta de brillo
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center p-2 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg">
            <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
              <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                <StarBlog />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <h2 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                Calma y equilibrio
              </h2>
              <p className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-500">
                Cuero cabelludo sensible
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex flex-col items-center gap-12 md:gap-14 lg:gap-16 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1320px]">
          <h2 className="text-[32px] font-medium leading-[40px] text-center text-black w-full">
            Productos recomendados para ti
          </h2>
          
          <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center md:items-start md:justify-center gap-12 w-full">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex flex-col justify-center items-start gap-6 w-full max-w-[400px] md:max-w-[320px] lg:max-w-[408px] lg:flex-1"
                >
                  <BestSellersCard product={product} />
                </div>
              ))
            ) : (
              <p className="w-full text-center text-gray-600">
                Cargando productos recomendados...
              </p>
            )}
          </div>
        </div>

        <div 
          className="flex flex-col items-center px-5 py-24 gap-8 md:px-12 md:gap-12 lg:px-[60px] lg:gap-16 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1320px] rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: "url('/blog_section.png')",
          }}
        >
          <div className="flex flex-col justify-center items-center gap-8 w-full max-w-[280px] md:max-w-[600px] lg:max-w-[1200px]">
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <h2 className="text-[36px] leading-[44px] md:text-[34px] md:leading-[42px] lg:text-[32px] lg:leading-[40px] font-medium text-center text-black w-full">
                ¿Necesitas asesoramiento personalizado?
              </h2>
              <p className="text-2xl leading-8 md:text-[26px] md:leading-[34px] lg:text-[28px] lg:leading-[36px] font-normal text-center text-black w-full">
                Contacta directamente para una consulta y resolver todas tus dudas
              </p>
            </div>

            <button
              type="button"
              className="flex justify-center items-center w-[215px] h-12 hover:opacity-90 transition-opacity"
            >
              <div className="flex flex-row justify-center items-center px-4 py-[10px] gap-2 w-full h-10 bg-[#215E6B] rounded-full">
                <Star className="w-5 h-5 text-white flex-none" />
                <span className="font-medium text-sm leading-5 tracking-[0.1px] text-white">
                  {t('routine.button')}
                </span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}