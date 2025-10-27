'use client';

import FOOTER_LINKS from '@/data/Footer';
import { useI18n } from '@/hooks';
import Link from 'next/link';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer
      className="
        flex flex-col md:flex-row justify-between items-start
        px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[60px]
        py-6 md:py-6 gap-4 md:gap-[10px]
        w-full min-h-[100px] md:h-[100px]
        bg-white
      "
    >
      <nav
        className="
          flex flex-col sm:flex-row items-start
          gap-4 sm:gap-6 md:gap-8
        "
      >
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="
              font-roboto font-normal text-sm sm:text-base
              leading-6 tracking-[0.5px] text-[#808080]
              hover:text-[#1D1B20] transition-colors
              text-left
            "
          >
            {t(link.label)}
          </Link>
        ))}
      </nav>

      <p
        className="
          font-roboto font-normal text-sm sm:text-base
          leading-6 tracking-[0.5px] text-[#808080]
          text-left
        "
      >
        {t('footer.copyright')}
      </p>
    </footer>
  );
};
