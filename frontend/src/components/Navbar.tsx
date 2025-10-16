'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import logo from '../../public/logo.svg';
import { Roboto } from 'next/font/google';
import { IoSearchSharp } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa6';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';
import { NAV_LINKS } from '@/data/NavLinks';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const Navbar = () => {
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav
        className={`bg-white h-[100px] shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] relative z-40 ${roboto.className}`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[60px] h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center h-[54px] w-auto max-w-[233.28px] transition-opacity hover:opacity-80"
                aria-label={t('navbar.brand')}
              >
                <Image src={logo} alt="Logo" className="h-full w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-8 ml-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="font-roboto font-medium text-base leading-6 tracking-[0.15px] text-[#1D1B20] hover:text-gray-600 transition-colors whitespace-nowrap"
                >
                  {t(`navbar.${link.key}`)}
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <IoSearchSharp size={24} />
              </button>

              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <MdOutlineShoppingBag size={24} />
              </button>

              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="User account"
              >
                <FaRegUser size={24} />
              </button>

              {/* Language switcher visible on large screens */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex md:hidden items-center gap-1 ml-auto">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <IoSearchSharp size={20} />
              </button>

              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <MdOutlineShoppingBag size={20} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>

            {/* Tablet Menu Toggle (md screens) */}
            <div className="hidden md:flex lg:hidden items-center ml-4">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile/Tablet Menu Drawer */}
      <div
        className={`fixed top-[100px] right-0 h-[calc(100vh-100px)] w-80 max-w-[90vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Navigation Links */}
          <div className="flex-1 px-6 py-8">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block font-roboto font-medium text-lg leading-7 text-[#1D1B20] hover:text-gray-600 hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                >
                  {t(`navbar.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="User account"
                onClick={closeMobileMenu}
              >
                <FaRegUser size={24} />
              </button>

              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
