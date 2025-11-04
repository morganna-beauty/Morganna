'use client'


import React, { useState, useMemo, useCallback } from "react";
import StarBlog from "@/Icons/StartBlogIcon";
import { useI18n } from "@/hooks/useI18n";

export const ProductIngredients = ({ ingredients }: { ingredients: string[] }) => {
  const { t } = useI18n();
  const [isPaused, setIsPaused] = useState(false);

  const displayIngredients = useMemo(
    () => ingredients.length > 0 ? [...ingredients, ...ingredients, ...ingredients] : [],
    [ingredients]
  );

  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  if (!ingredients.length) return null;

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <h2 className="text-[22px] font-medium leading-7 text-black">{t('product.keyIngredients')}</h2>

      <div className="w-full overflow-hidden">
        <div
          className="flex gap-6 cursor-pointer"
          style={{
            animation: isPaused ? 'none' : `scroll ${ingredients.length * 8}s linear infinite`,
          }}
          onClick={togglePause}
        >
          {displayIngredients.map((ingredient, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] flex flex-col justify-center items-start p-6 gap-3.5 bg-white border border-[#E4E4E4] rounded-lg">
              <div className="flex flex-row justify-center items-center w-12 h-12">
                <div className="flex flex-col justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                  <StarBlog />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">{ingredient}</h3>
                <p className="text-sm font-medium leading-5 tracking-[0.1px] text-[#808080]">
                  {t('product.ingredientCardDescription')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-280px * ${ingredients.length} - 24px * ${ingredients.length}));
          }
        }
        @media (min-width: 640px) {
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-320px * ${ingredients.length} - 24px * ${ingredients.length}));
            }
          }
        }
      `}</style>
    </div>
  );
};
