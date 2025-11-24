'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import LangSwitcher from "../../ui/LangSwitcher";

interface NavItem {
  id: string;
  translationKey: string;
}

const navItems: NavItem[] = [
  { id: "home", translationKey: "navigation.home" },
  { id: "solutions", translationKey: "navigation.solutions" },
  { id: "about", translationKey: "navigation.about" },
  { id: "contact", translationKey: "navigation.contact" },
];

const Navigation = () => {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState("home");

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="flex items-center" data-name="Navigation">
      
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
