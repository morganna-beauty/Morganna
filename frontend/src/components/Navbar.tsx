'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import logo from '../../public/logo.svg';
import { Roboto } from 'next/font/google';
import { IoSearchSharp } from 'react-icons/io5';
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineShoppingBag } from 'react-icons/md';
import NAV_LINKS from '@/data/NavLinks';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const Navbar = () => {
  const { t } = useI18n();

  return (
    <nav
      className={`bg-white h-[100px] shadow-[0px_1px_2px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] ${roboto.className}`}
    >
      <div className="max-w-[1440px] mx-auto px-[60px] h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center h-[54px] w-[233.28px] transition-opacity hover:opacity-80"
              aria-label={t('navbar.brand')}
            >
              <Image src={logo} alt="Logo"></Image>
            </Link>

            <div className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="font-roboto font-medium text-base leading-6 tracking-[0.15px] text-[#1D1B20] hover:text-gray-600 transition-colors"
                >
                  {t(`navbar.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <IoSearchSharp size={24}/>
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <MdOutlineShoppingBag size={24}/>
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <FaRegUser size={24}/>

            </button>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};
