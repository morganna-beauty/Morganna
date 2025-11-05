'use client';

import React, { useMemo, memo } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
  asLink?: boolean;
  href?: string;
}

const CartIconComponent: React.FC<CartIconProps> = ({ 
  onClick, 
  className = '', 
  asLink = false, 
  href = '/cart' 
}) => {
  const { totalItems, isLoading } = useCart();

  const displayCount = useMemo(() => 
    totalItems > 99 ? '99+' : totalItems, 
    [totalItems]
  );

  const cartSvgIcon = useMemo(() => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  ), []);

  const badgeComponent = useMemo(() => (
    totalItems > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#215E6B] to-[#1a4d57] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
        {displayCount}
      </span>
    )
  ), [totalItems, displayCount]);

  const loadingIndicator = useMemo(() => (
    isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-80 rounded-full flex items-center justify-center backdrop-blur-sm">
        <div className="w-4 h-4 border-2 border-gray-200 border-t-[#215E6B] rounded-full animate-spin"></div>
      </div>
    )
  ), [isLoading]);

  const iconContent = useMemo(() => (
    <>
      {cartSvgIcon}
      {badgeComponent}
      {loadingIndicator}
    </>
  ), [cartSvgIcon, badgeComponent, loadingIndicator]);

  const baseClasses = useMemo(() => 
    `relative p-2 text-gray-600 hover:text-[#215E6B] transition-all duration-300 hover:bg-gray-50 ${className}`,
    [className]
  );

  const buttonClasses = useMemo(() => 
    `${baseClasses} ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'}`,
    [baseClasses, isLoading]
  );

  if (asLink) {
    return (
      <Link
        href={href}
        className={baseClasses}
      >
        {iconContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      disabled={isLoading}
      title="Carrito de compras"
    >
      {iconContent}
    </button>
  );
};

export const CartIcon = memo(CartIconComponent);
CartIcon.displayName = 'CartIcon';

export default CartIcon;