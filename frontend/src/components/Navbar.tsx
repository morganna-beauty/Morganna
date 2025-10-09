'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const { t } = useI18n();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {t('navbar.brand')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('navbar.products')}
            </Link>

            <Link
              href="/products/new"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('navbar.addProduct')}
            </Link>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};
