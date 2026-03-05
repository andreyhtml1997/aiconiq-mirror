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

const Navigation = () => {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    
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

  return (
    <nav className="flex items-center w-full overflow-x-auto md:w-auto md:overflow-visible" data-name="Navigation">
      
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`
            flex items-center justify-center
            px-2 py-1.5 md:px-4 md:py-1.5
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
            className="
              font-medium text-[14px] md:text-base text-white whitespace-nowrap
              leading-normal
            "
          >
            {t(item.translationKey)}
          </p>
        </button>
      ))}
      <LangSwitcher />
    </nav>
  );
};

export default Navigation;
