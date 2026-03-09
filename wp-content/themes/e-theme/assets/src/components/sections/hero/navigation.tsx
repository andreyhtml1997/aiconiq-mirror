'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import LangSwitcher from "../../ui/LangSwitcher";

interface NavItem {
  id: string;
  translationKey: string;
}

const navItems: NavItem[] = [
  { id: "home", translationKey: "navigation.home" },
  { id: "solutions", translationKey: "navigation.solutions" },
  { id: "about", translationKey: "navigation.about" },
  { id: "team", translationKey: "navigation.team" },
  { id: "blog", translationKey: "navigation.blog" },
  { id: "contact", translationKey: "navigation.contact" },
];

interface NavigationProps {
  variant?: 'desktop' | 'mobile';
  onNavClick?: () => void;
}

const Navigation = ({ variant = 'desktop', onNavClick }: NavigationProps) => {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    onNavClick?.();
    
    // Check if the current page is a subpage (not just "/" or "/[lang]")
    const isSubpage = (pathname !== `/${lang}` && (pathname !== '/' || !lang));
    
    if(itemId=='blog'){
      router.push(`https://blog.aiconiq.io/${lang}/articles`);
    }else if (isSubpage) {
      // Navigate to the homepage with the section ID as a hash
      router.push(`/${lang}#${itemId}`);
    } else {
      // On the homepage, use smooth scrolling
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const isMobile = variant === 'mobile';

  return (
    <nav 
      className={`flex w-full ${isMobile ? 'flex-col items-start gap-2' : 'items-center overflow-x-auto md:w-auto md:overflow-visible'}`} 
      data-name="Navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`
            flex items-center justify-center
            ${isMobile ? 'w-full px-4 py-3 text-left' : 'px-2 py-1.5 md:px-4 md:py-1.5'}
            transition-all duration-200
            ${
              activeItem === item.id
                ? "border-b border-[#d8008d]"
                : "border-b border-transparent hover:border-white/20"
            }
          `}
          data-name={`nav-${item.id}`}
        >
          <p
            className={`
              font-medium text-white whitespace-nowrap
              leading-normal
              ${isMobile ? 'text-lg' : 'text-[14px] md:text-base'}
            `}
          >
            {t(item.translationKey)}
          </p>
        </button>
      ))}
      <div className={isMobile ? 'mt-4 px-4 w-full ' : ''}>
        <LangSwitcher />
      </div>
    </nav>
  );
};

export default Navigation;
