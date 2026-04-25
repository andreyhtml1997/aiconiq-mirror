'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import LangSwitcher from "../../ui/LangSwitcher";
import type { MenuItem } from "@/lib/wp";

interface NavItem {
  id: string;
  label: string;
  url?: string;
  target?: string;
  external?: boolean;
}

// Hardcoded fallback used when no WP `items` prop is passed (e.g. the
// hero header before WP REST data is wired in).
const DEFAULT_NAV_KEYS: { id: string; translationKey: string }[] = [
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
  /** When set, render these WP menu items instead of the hardcoded fallback. */
  items?: MenuItem[];
}

const Navigation = ({ variant = 'desktop', onNavClick, items }: NavigationProps) => {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const navItems: NavItem[] = items?.length
    ? items.map((it) => {
        const hashAnchor = it.url.includes('#') ? it.url.slice(it.url.indexOf('#') + 1) : '';
        const isExternal = it.target === '_blank' || /^https?:\/\//.test(it.url);
        return {
          id: hashAnchor || `wp-${it.id}`,
          label: it.label,
          url: it.url,
          target: it.target,
          external: isExternal && !hashAnchor,
        };
      })
    : DEFAULT_NAV_KEYS.map((d) => ({ id: d.id, label: t(d.translationKey) }));

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.id);
    onNavClick?.();

    // External / WP-driven absolute URL: just navigate.
    if (item.external && item.url) {
      router.push(item.url);
      return;
    }

    // Check if the current page is a subpage (not just "/" or "/[lang]")
    const isSubpage = (pathname !== `/${lang}` && (pathname !== '/' || !lang));

    if (item.id === 'blog') {
      router.push(`https://blog.aiconiq.io/${lang}/articles`);
    } else if (isSubpage) {
      // Navigate to the homepage with the section ID as a hash
      router.push(`/${lang}#${item.id}`);
    } else {
      // On the homepage, use smooth scrolling
      const element = document.getElementById(item.id);
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
          onClick={() => handleNavClick(item)}
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
            {item.label}
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
