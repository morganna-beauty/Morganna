'use client';

import FOOTER_LINKS from '@/data/Footer';
import { useI18n } from '@/hooks';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="flex flex-row justify-between items-center px-[60px] py-6 gap-[10px] w-full h-[100px] bg-white">
      <nav className="flex flex-row items-center gap-8 mx-auto">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="font-roboto font-normal text-base leading-6 tracking-[0.5px] text-[#808080] hover:text-[#1D1B20] transition-colors"
          >
            {t(link.label)}
          </a>
        ))}
      </nav>

      <p className="font-roboto font-normal text-base leading-6 tracking-[0.5px] text-[#808080] mx-auto">
        {t('footer.copyright')}
      </p>
    </footer>
  );
};

export default Footer;
