'use client';

import React, { memo } from "react";
import { useProductButtons } from "@/hooks";
import { Product } from "@/types";

interface ProductButtonsProps {
  product?: Product;
  onAddToBag?: () => void;
  onBuyWhatsApp?: () => void;
  whatsappNumber?: string;
}

const ButtonsProductComponent = ({
  product,
  onAddToBag,
  onBuyWhatsApp,
  whatsappNumber = "18099694607",
}: ProductButtonsProps) => {
  const {
    isProductInCart,
    itemQuantity,
    isAddingToCart,
    handleAddToBag,
    handleBuyWhatsApp,
    addToBagButtonClasses,
    loadingText,
    inCartText,
    addToBagText,
    whatsappButtonText,
  } = useProductButtons({
    product,
    onAddToBag,
    onBuyWhatsApp,
    whatsappNumber,
  });

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      
      <button
        onClick={handleAddToBag}
        disabled={isAddingToCart}
        className="flex flex-row justify-center items-center w-full h-12 min-h-[48px]"
      >
        <div className={addToBagButtonClasses}>
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium leading-5 tracking-[0.1px] text-gray-600 whitespace-nowrap">
                {loadingText}
              </span>
            </>
          ) : isProductInCart ? (
            <>
              <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium leading-5 tracking-[0.1px] text-green-700 whitespace-nowrap">
                {inCartText}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#215E6B] whitespace-nowrap">
              {addToBagText}
            </span>
          )}
        </div>
      </button>

      <button
        onClick={handleBuyWhatsApp}
        className="flex flex-row justify-center items-center w-full h-12 min-h-[48px]"
      >
        <div className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 bg-[#215E6B] rounded-full w-full transition-all hover:opacity-80">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="text-sm font-medium leading-5 tracking-[0.1px] text-white whitespace-nowrap">
            {whatsappButtonText}
          </span>
        </div>
      </button>
    </div>
  );
};

export const ButtonsProduct = memo(ButtonsProductComponent);
ButtonsProduct.displayName = "ButtonsProduct";
