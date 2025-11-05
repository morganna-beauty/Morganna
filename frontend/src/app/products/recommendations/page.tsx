"use client";

import { useEffect, useMemo, useState } from "react";
import BestSellersCard from "@/components/BestSellersCard";
import { Product, Concern } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { getRecommendationKeyFromConcerns } from "@/data/diagnostic-mapping";
import StarBlog from "@/Icons/StartBlogIcon";
import { StartDiagnosticButton } from "@/components/StartDiagnosticButton";

interface PageProps {
  searchParams?: Record<string, string | string[]>;
}

export default function RecommendationsPage({ searchParams = {} }: PageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const concernsParam = searchParams.concerns;
  const { t } = useI18n();

  const concerns = useMemo(() => {
    if (!concernsParam) return [] as string[];

    const concernsArray = Array.isArray(concernsParam) ? concernsParam : [concernsParam];

    return Array.from(new Set(concernsArray));
  }, [concernsParam]);

  /**
   * Convierte cada concern de la URL a un RecommendationKey para mostrar el header correspondiente.
   * 
   * Ejemplo:
   * - URL: ?concerns=danoReparacion&concerns=cabelloSeco
   * - Concerns: ['danoReparacion', 'cabelloSeco']
   * - RecKeys: ['repair', 'hydration'] (sin duplicados)
   * - Headers mostrados:
   *   1. diagnostic.recommendationHeader.repair (Reparación y fuerza)
   *   2. diagnostic.recommendationHeader.hydration (Hidratación profunda)
   */
  const uniqueRecKeys = useMemo(() => {
    const recKeysSet = new Set<string>();
    
    concerns.forEach((concern) => {
      const recKey = getRecommendationKeyFromConcerns([concern as Concern]);

      recKeysSet.add(recKey);
    });

    return Array.from(recKeysSet);
  }, [concerns]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = concerns
          .map((c) => `concerns=${encodeURIComponent(c)}`)
          .join("&");
        const url = `http://localhost:3001/api/products${
          query ? `?${query}` : ""
        }`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        setProducts(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          console.error(e);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [concerns]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-lg">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto bg-white">
      <div className="flex flex-col items-center px-5 py-8 gap-8 md:px-12 md:py-12 lg:px-[60px] lg:py-[60px]">
        
        <div className="flex flex-col justify-center items-center gap-2 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1012px]">
          <h1 className="text-[28px] leading-[36px] md:text-[30px] md:leading-[38px] lg:text-[32px] lg:leading-[40px] font-medium text-center text-black w-full">
            {t(`diagnostic.result`)}
          </h1>
          <p className="text-sm leading-5 md:text-lg md:leading-6 lg:text-[28px] lg:leading-[36px] font-semibold md:font-normal text-center text-gray-500 w-full tracking-[0.1px] lg:tracking-normal">
            {t(`diagnostic.details`)}
          </p>
        </div>

        {uniqueRecKeys.length > 0 && (
          <div className="flex flex-col items-start gap-3 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1114px]">
            {uniqueRecKeys.map((recKey) => (
              <div
                key={recKey}
                className="flex flex-row items-center p-2 gap-[14px] w-full bg-white border border-[#215E6B] rounded-lg"
              >
                <div className="flex justify-center items-center w-12 h-12 flex-shrink-0">
                  <div className="flex justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                    <StarBlog />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                  <h2 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">
                    {t(`diagnostic.recommendationHeader.${recKey}.title`)}
                  </h2>
                  <p className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-500">
                    {t(`diagnostic.recommendationHeader.${recKey}.detail`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-12 md:gap-14 lg:gap-16 w-full max-w-[400px] md:max-w-[700px] lg:max-w-[1320px]">
          <h2 className="text-[32px] font-medium leading-[40px] text-center text-black w-full">
            {t("diagnostic.recommendedProducts")}
          </h2>

          <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center md:items-start md:justify-center gap-12 w-full">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-center items-start gap-6 w-full max-w-[400px] md:max-w-[320px] lg:max-w-[408px] lg:flex-1"
                >
                  <BestSellersCard product={product} />
                </div>
              ))
            ) : (
              <p className="w-full text-center text-gray-600">
                {t("common.noProducts")}
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
                {t("diagnostic.personalAdviceTitle")}
              </h2>
              <p className="text-2xl leading-8 md:text-[26px] md:leading-[34px] lg:text-[28px] lg:leading-[36px] font-normal text-center text-black w-full">
                {t("diagnostic.personalAdviceDetail")}
              </p>
            </div>

            <StartDiagnosticButton className="w-[215px] h-12" buttonClassName="w-full h-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
