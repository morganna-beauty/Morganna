"use client"

import type React from "react"
import { memo, useState, useMemo, useCallback, useRef } from "react"
import StarBlog from "@/Icons/StartBlogIcon"
import { useI18n } from "@/hooks/useI18n"

interface ProductIngredientsProps {
  ingredients: string[];
}

const ProductIngredientsComponent = ({ ingredients }: ProductIngredientsProps) => {
  const { t } = useI18n()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const displayIngredients = useMemo(
    () => (ingredients.length > 0 ? [...ingredients, ...ingredients, ...ingredients] : []),
    [ingredients],
  )

  const cardWidth = typeof window !== "undefined" && window.innerWidth >= 640 ? 320 : 280
  const gap = 24
  const totalWidth = (cardWidth + gap) * ingredients.length

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    if (containerRef.current) {
      const transform = window.getComputedStyle(containerRef.current).transform

      if (transform !== "none") {
        const matrix = new DOMMatrix(transform)
        
        setCurrentTranslate(matrix.m41)
      }
    }
  }, [])

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return
      const diff = clientX - startX

      setScrollLeft(diff)
    },
    [isDragging, startX],
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setCurrentTranslate((prev) => {
      const newTranslate = prev + scrollLeft
      // Normalize to keep within bounds for seamless loop

      return newTranslate % -totalWidth
    })
    setScrollLeft(0)
  }, [isDragging, scrollLeft, totalWidth])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }, [handleDragStart])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }, [handleDragMove])

  const onMouseUp = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  const onMouseLeave = useCallback(() => {
    if (isDragging) handleDragEnd()
  }, [isDragging, handleDragEnd])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }, [handleDragStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }, [handleDragMove])

  const onTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  if (!ingredients.length) return null

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      <h2 className="text-[22px] font-medium leading-7 text-black">{t("product.keyIngredients")}</h2>

      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-6 cursor-grab active:cursor-grabbing select-none"
          style={{
            animation: isDragging ? "none" : `scroll ${ingredients.length * 8}s linear infinite`,
            transform: isDragging ? `translateX(${currentTranslate + scrollLeft}px)` : undefined,
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {displayIngredients.map((ingredient, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[320px] flex flex-col justify-center items-start p-6 gap-3.5 bg-white border border-[#E4E4E4] rounded-lg"
            >
              <div className="flex flex-row justify-center items-center w-12 h-12">
                <div className="flex flex-col justify-center items-center w-10 h-10 bg-[#B6D6DD] rounded-full">
                  <StarBlog />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="text-sm font-semibold leading-5 tracking-[0.1px] text-black">{ingredient}</h3>
                <p className="text-sm font-medium leading-5 tracking-[0.1px] text-[#808080]">
                  {t("product.ingredientCardDescription")}
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
  )
}

export const ProductIngredients = memo(ProductIngredientsComponent);
ProductIngredients.displayName = 'ProductIngredients';
