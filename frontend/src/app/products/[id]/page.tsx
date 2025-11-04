'use client';

import { useEffect, useState } from "react";
import { ButtonsProduct, ProductBenefits, ProductImage, ProductIngredients } from "@/components";
import { useI18n } from "@/hooks/useI18n";

interface ProductProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { cache: 'no-store' });

  if (!res.ok) throw new Error(`Error al obtener producto ${id}`);

  return res.json();
}

export default function ProductPage({ params }: ProductProps) {
  const [product, setProduct] = useState<any>(null);
  const { t } = useI18n();

  useEffect(() => {
    getProduct(params.id).then(setProduct);
  }, [params.id]);

  if (!product) return <div className="flex justify-center items-center min-h-screen text-lg">{t('common.loading')}</div>;

  return (
    <div className="flex flex-col items-center px-5 py-8 gap-8 w-full lg:flex-row lg:justify-center lg:px-[60px] lg:py-[60px] lg:max-w-[1440px] lg:mx-auto">
      <div className="flex flex-col justify-center items-start gap-8 w-full max-w-[400px] lg:w-[866px] lg:max-w-none">
        <div className="flex flex-col items-start gap-8 w-full lg:flex-row">
          <ProductImage src={product.imageSrc || product.image} title={product.title} />
          <div className="flex flex-col justify-center items-start gap-8 w-full lg:flex-1">
            <h1 className="text-[32px] font-medium leading-10 text-black">{product.title}</h1>
            <ProductBenefits benefits={product.benefits} />

            <ButtonsProduct productTitle={product.title}/>
          </div>
        </div>

        <div>
          <h2 className="text-[22px] font-medium leading-7 text-black">{t('product.description')}</h2>
          <p className="text-base font-normal leading-6 tracking-[0.5px] text-black">{product.description}</p>
        </div>

        <ProductIngredients ingredients={product.ingredients || []} />
      </div>
    </div>
  );
}
