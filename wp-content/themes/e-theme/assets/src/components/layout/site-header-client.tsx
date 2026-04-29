'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import LangSwitcher from '../ui/LangSwitcher'
import type { MenuItem } from '@/lib/wp'

interface SiteHeaderClientProps {
  items: MenuItem[]
  lang: string
}

const logo = '/assets/logo.svg'

// Show the sticky header the moment the hero's own embedded header scrolls out
// of view. Hero marks its nav row with `data-sticky-trigger="hero-nav"`; we
// observe it via IntersectionObserver so layout changes (mobile/desktop) work
// automatically. Fallback to a px threshold if the trigger isn't on the page
// (e.g. articles or arbitrary WP Pages without a Hero block).
const FALLBACK_THRESHOLD_PX = 80

const SiteHeaderClient = ({ items, lang }: SiteHeaderClientProps) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>('[data-sticky-trigger="hero-nav"]')

    // No Hero on this page — there's no inline nav, so the sticky must be
    // permanently visible (otherwise the page has no menu at all until the
    // user happens to scroll past 80px). This covers /page/[slug], articles,
    // imprint, etc.
    if (!trigger) {
      setVisible(true)
      return
    }

    // Pages WITH Hero: keep the original sticky behaviour — hidden until the
    // hero's own nav scrolls past the viewport top, then slide in.
    const onScroll = () => {
      const rect = trigger.getBoundingClientRect()
      setVisible(rect.top + rect.height / 2 < 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const handleClick =
    (item: MenuItem) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Anchor on the home page — smooth-scroll if we're already on home.
      if (item.url.includes('#')) {
        const hash = item.url.slice(item.url.indexOf('#') + 1)
        const isOnHome = pathname === `/${lang}` || pathname === '/' || pathname === `/${lang}/`
        if (isOnHome) {
          const target = document.getElementById(hash)
          if (target) {
            e.preventDefault()
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            history.replaceState(null, '', `#${hash}`)
            return
          }
        }
        e.preventDefault()
        router.push(`/${lang}#${hash}`)
        return
      }

      // Internal Next.js path (e.g. /en/page/foo/). Use the router to avoid
      // a full reload that a plain <a href> would trigger.
      if (item.url.startsWith('/')) {
        e.preventDefault()
        router.push(item.url)
      }
      // Absolute URLs fall through to the default <a> behaviour.
    }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0F0E0E]/85 backdrop-blur-md border-b border-white/5
        ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
      `}
      data-name="SiteHeader"
      aria-hidden={!visible}
    >
      {/* Match the hero header layout: full-width row, logo on the left,
          nav + lang switcher grouped on the right, no internal max-width. */}
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link href={`/${lang}`} className="flex-shrink-0">
          <img
            src={logo}
            alt="aiconiq"
            className="h-7 sm:h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2 lg:gap-4">
          {items.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.target || '_self'}
                  onClick={handleClick(item)}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="px-2 lg:px-4 py-1.5 text-[14px] lg:text-base font-medium text-white whitespace-nowrap border-b border-transparent hover:border-white/30 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="hidden md:block">
            <LangSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeaderClient
