'use client'

import { useState, useMemo, useCallback } from 'react';
import { useI18n } from './useI18n';

interface UseProductIngredientsProps {
  ingredients: string[];
}

export const useProductIngredients = ({ ingredients }: UseProductIngredientsProps) => {
  const { t } = useI18n();
  const [isPaused, setIsPaused] = useState(false);

  const displayIngredients = useMemo(
    () => ingredients.length > 0 ? [...ingredients, ...ingredients, ...ingredients] : [],
    [ingredients]
  );

  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  const animationDuration = useMemo(
    () => ingredients.length * 8,
    [ingredients.length]
  );

  const animationStyle = useMemo(() => ({
    animation: isPaused ? 'none' : `scroll ${animationDuration}s linear infinite`,
  }), [isPaused, animationDuration]);

  const keyframesCSS = useMemo(() => `
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
  `, [ingredients.length]);

  const shouldRender = useMemo(() => ingredients.length > 0, [ingredients.length]);

  const translations = useMemo(() => ({
    keyIngredients: t('product.keyIngredients'),
    ingredientCardDescription: t('product.ingredientCardDescription'),
  }), [t]);

  return {
    isPaused,
    displayIngredients,
    togglePause,
    animationStyle,
    keyframesCSS,
    shouldRender,
    translations,
  };
};