'use client'

import { memo, useMemo } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ProductBenefitsProps {
  benefits: string[];
}

const ProductBenefitsComponent = ({ benefits }: ProductBenefitsProps) => {
  const { t } = useI18n();
  
  const benefitsTitle = useMemo(() => t('product.benefitsTitle'), [t]);
  
  const benefitsList = useMemo(() => {
    if (!benefits?.length) return null;
    
    return benefits.map((benefit, i) => (
      <div key={`${benefit}-${i}`} className="flex flex-row items-start gap-2">
        <Check className="w-6 h-6 text-[#1D1B20] flex-shrink-0 mt-0.5" />
        <span className="text-base font-normal leading-6 tracking-[0.5px] text-[#1E1E1E]">
          {benefit}
        </span>
      </div>
    ));
  }, [benefits]);
  
  if (!benefits?.length) return null;

  return (
    <div className="flex flex-col justify-center items-start gap-6 w-full">
      <h2 className="text-[22px] font-medium leading-7 text-black">{benefitsTitle}</h2>
      <div className="flex flex-col items-start gap-3">
        {benefitsList}
      </div>
    </div>
  );
};

export const ProductBenefits = memo(ProductBenefitsComponent);
ProductBenefits.displayName = 'ProductBenefits';
