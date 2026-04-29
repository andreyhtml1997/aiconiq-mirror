'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Navigation from '@/components/sections/hero/navigation'

/**
 * Top-of-page navigation row for non-Hero pages.
 *
 * The home page renders its nav inside <Hero/> (logo + menu over the hero
 * video, marked with `data-sticky-trigger="hero-nav"` so the fixed dark
 * SiteHeader knows when to slide in). Sub-pages have no Hero, so we render
 * this lightweight twin: same logo + Navigation + mobile drawer, with the
 * same trigger attribute. The result: visually a header at the top, then on
 * scroll the dark sticky one takes over — exact same UX as home.
 */
const InlineNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const logoUrl = '/assets/logo.svg'

  return (
    <>
      {/* Mobile burger — fixed in viewport corner, mirrors Hero's pattern. */}
      <button
        className="md:hidden fixed top-[16px] right-[16px] p-2 text-white z-[60] bg-black/50 rounded-full backdrop-blur-sm transition-transform duration-300 ease-out"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X size={24} strokeWidth={2} />
        ) : (
          <Menu size={24} strokeWidth={2} />
        )}
      </button>

      {/* Inline nav row — logo on the left, Navigation on the right. */}
      <div
        data-sticky-trigger="hero-nav"
        className="flex flex-row p-3 xs:p-4 sm:p-5 md:p-6 lg:p-[28px] items-start sm:items-center w-full justify-between relative z-10 gap-3 xs:gap-4 sm:gap-0 max-w-[1920px] mx-auto"
      >
        <a href="/">
          <img
            src={logoUrl}
            className="w-full"
            style={{ maxWidth: 'clamp(120px, 20vw, 193px)' }}
            alt=""
          />
        </a>
        <div className="hidden md:block">
          <Navigation />
        </div>
      </div>

      {/* Mobile menu drawer — same overlay + slide-in panel as Hero. */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full bg-black/95 backdrop-blur-md border-l border-white/10 shadow-2xl">
            <button
              className="absolute top-[20px] right-[20px] p-2 text-white z-50"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2} />
            </button>
            <div className="flex flex-col h-full pt-20 pb-6 px-4">
              <Navigation
                variant="mobile"
                onNavClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InlineNavBar
