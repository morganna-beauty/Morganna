'use client'

import { useI18n } from "@/hooks";


const FOOTER_LINKS = [
  { id: 1, label: 'footer.privacy', href: '/privacy' },
  { id: 2, label: 'footer.terms', href: '/terms' },
  { id: 3, label: 'footer.contact', href: '/contact' },
];
 
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

export default Footer