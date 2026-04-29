'use client';

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import LangSwitcher from "../../ui/LangSwitcher";
import { usePrimaryMenu } from "../../layout/PrimaryMenuProvider";
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
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  // Manual override fires when the user clicks an in-page anchor — pathname
  // doesn't change (still on home), but we want the clicked item to glow.
  // Reset whenever the route changes so derivation from pathname takes over.
  const [manualActive, setManualActive] = useState<string | null>(null);
  useEffect(() => { setManualActive(null); }, [pathname]);

  // Items resolution priority:
  //   1. explicit `items` prop (used by Footer with its own menu)
  //   2. primary menu from React Context (Hero embedded nav)
  //   3. hardcoded i18n fallback (build-time / no WP)
  const ctxItems = usePrimaryMenu();
  const sourceItems: MenuItem[] = items?.length ? items : ctxItems;

  const navItems: NavItem[] = sourceItems.length
    ? sourceItems.map((it) => {
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

  // Derive the active item from the current path: match by URL, or fall back
  // to the "home" entry when we're literally on /{lang} or /{lang}/.
  const cleanPath = pathname.replace(/\/+$/, '');
  let derivedActive: string | null = null;
  for (const it of navItems) {
    if (!it.url) continue;
    const itemPath = it.url.split('#')[0].replace(/\/+$/, '');
    if (itemPath && itemPath === cleanPath) { derivedActive = it.id; break; }
  }
  if (!derivedActive && (pathname === `/${lang}` || pathname === `/${lang}/` || pathname === '/')) {
    derivedActive = navItems.find((it) => it.id === 'home')?.id ?? null;
  }
  const activeItem = manualActive ?? derivedActive;

  const handleNavClick = (item: NavItem) => {
    setManualActive(item.id);
    onNavClick?.();

    if (!item.url) return;

    // 1. Anchor (#solutions etc.) — smooth-scroll if on home, otherwise
    //    navigate to home with the hash so Next.js can scroll after mount.
    if (item.url.includes('#')) {
      const hash = item.url.slice(item.url.indexOf('#') + 1);
      const isOnHome = pathname === `/${lang}` || pathname === '/' || pathname === `/${lang}/`;
      if (isOnHome) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      router.push(`/${lang}#${hash}`);
      return;
    }

    // 2. Internal Next.js path — /en/page/foo/, /de/articles/, ...
    if (item.url.startsWith('/')) {
      router.push(item.url);
      return;
    }

    // 3. Absolute / external URL
    if (item.target === '_blank') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.url);
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
