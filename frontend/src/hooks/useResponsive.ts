/**
 * Custom hook for responsive design utilities
 *
 * Provides utilities for detecting screen sizes and managing responsive state
 */

import { useState, useEffect } from 'react';

// Breakpoint definitions
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('sm');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;

      if (width >= breakpoints['2xl']) {
        setScreenSize('2xl');
      } else if (width >= breakpoints.xl) {
        setScreenSize('xl');
      } else if (width >= breakpoints.lg) {
        setScreenSize('lg');
      } else if (width >= breakpoints.md) {
        setScreenSize('md');
      } else if (width >= breakpoints.sm) {
        setScreenSize('sm');
      } else {
        setScreenSize('xs');
      }

      setIsMobile(width < breakpoints.md);
      setIsTablet(width >= breakpoints.md && width < breakpoints.lg);
      setIsDesktop(width >= breakpoints.lg);
    };

    // Set initial values
    if (typeof window !== 'undefined') {
      updateScreenSize();
    }

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
};

// Hook for media queries
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Pre-defined media query hooks
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

// Responsive utilities
export const responsiveUtils = {
  // Get responsive text size classes
  getTextSize: (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const sizes = {
      sm: 'text-sm sm:text-base',
      md: 'text-base sm:text-lg lg:text-xl',
      lg: 'text-lg sm:text-xl lg:text-2xl',
      xl: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl',
    };

    return sizes[size];
  },

  // Get responsive spacing classes
  getSpacing: (size: 'sm' | 'md' | 'lg') => {
    const spacing = {
      sm: 'p-4 sm:p-6',
      md: 'p-6 sm:p-8 lg:p-10',
      lg: 'p-8 sm:p-12 lg:p-16',
    };

    return spacing[size];
  },

  // Get responsive grid classes
  getGrid: (cols: 2 | 3 | 4) => {
    const grids = {
      2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
      3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
      4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
    };

    return grids[cols];
  },

  // Get responsive container classes
  getContainer: (type: 'full' | 'constrained') => {
    return type === 'full'
      ? 'w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[60px]'
      : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  },
};
