'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>('[data-sticky-trigger="hero-nav"]')

    // Show the sticky as soon as the actual nav text in the hero scrolls past
    // the viewport top. The trigger element wraps the logo+nav with extra
    // padding, so we fire when its center crosses the top edge — that's roughly
    // when the menu items themselves disappear.
    const onScroll = () => {
      if (trigger) {
        const rect = trigger.getBoundingClientRect()
        setVisible(rect.top + rect.height / 2 < 0)
      } else {
        setVisible(window.scrollY > FALLBACK_THRESHOLD_PX)
      }
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
      if (item.kind !== 'anchor') return
      const hashIndex = item.url.indexOf('#')
      if (hashIndex === -1) return
      const id = item.url.slice(hashIndex + 1)
      const target = document.getElementById(id)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${id}`)
      }
    }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0F0E0E]/85 backdrop-blur-md border-b border-white/5
        ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
      `}
      data-name="SiteHeader"
      aria-hidden={!visible}
    >
      <div className="max-w-[1280px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link href={`/${lang}`} className="flex-shrink-0">
          <img
            src={logo}
            alt="aiconiq"
            className="h-7 sm:h-8 w-auto"
          />
        </Link>

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
    </header>
  )
}

export default SiteHeaderClient
