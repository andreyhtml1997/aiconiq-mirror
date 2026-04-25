'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navigation from '../sections/hero/navigation'
import type { FooterData } from '@/types/blocks'
import type { MenuItem } from '@/lib/wp'

const FALLBACK_LOGO = '/assets/footer/aiconiq-logo-purple.svg'
const FALLBACK_BIG_LOGO = '/assets/footer/AICONIQ.svg'

interface FooterProps {
  data?: FooterData | null
  /** Items for the top nav strip — usually the WP `primary` menu so the
   *  footer mirrors the header. Passed in by the server-side Layout. */
  navItems?: MenuItem[]
}

const Footer = ({ data, navItems }: FooterProps = {}) => {
  const t = useTranslations()
  const params = useParams()
  const lang = params.lang as string

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logoSrc = data?.logo?.url || FALLBACK_LOGO
  const bigLogoSrc = data?.big_logo?.url || FALLBACK_BIG_LOGO
  const description = data?.description || t('footer.description')
  const email = data?.email || 'contact@aiconiq.io'
  const socialLabel = data?.social_label || t('footer.social')
  const linksLabel = data?.links_label || t('footer.links')

  const socialLinks = data?.socials?.length
    ? data.socials
    : [{ name: 'Linkedin', url: 'https://www.linkedin.com/company/aiconiq-group/posts/' }]

  const footerLinks = data?.links?.length
    ? data.links
    : [
        { name: t('footer.footerLinks.impressum'), url: `/${lang}/imprint` },
        { name: t('footer.footerLinks.terms'), url: 'https://aiconiq.io/ds.pdf' },
      ]

  return (
    <footer className="w-full pt-12 sm:pt-16 md:pt-20 lg:pt-[96px] px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1280px] w-full mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[103px]">
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[163px] w-full">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <img
              src={logoSrc}
              className="w-full"
              style={{ maxWidth: 'clamp(180px, 30vw, 263px)' }}
              alt=""
            />
            <Navigation items={navItems} />
          </div>

          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-0">
            <button
              onClick={scrollToTop}
              className="rounded-full border border-[#272725] flex items-center justify-center relative overflow-hidden group transition-all duration-300 hover:bg-[#D8008D] hover:border-[#D8008D] mx-auto lg:mx-0"
              style={{
                width: 'clamp(200px, 40vw, 302px)',
                height: 'clamp(200px, 40vw, 302px)',
              }}
            >
              <div
                className="relative"
                style={{
                  width: 'clamp(80px, 15vw, 108px)',
                  height: 'clamp(90px, 18vw, 121px)',
                }}
              >
                {/* First arrow - visible by default, moves up and disappears on hover */}
                <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-[200%]">
                  <ArrowUpIcon />
                </div>
                {/* Second arrow - hidden below, comes up to original position on hover */}
                <div className="absolute inset-0 translate-y-[200%] transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                  <ArrowUpIcon />
                </div>
              </div>
            </button>

            <div className="max-w-full lg:max-w-[628px] w-full flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[75px]">
              <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
                <a
                  href={`mailto:${email}`}
                  className="text-[#FFFFFF8F] leading-[160%] transition-colors duration-300 hover:text-[#D8008D]"
                  style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                >
                  {email}
                </a>
                <p
                  className="max-w-full sm:max-w-[328px] w-full text-[#FFFFFF8F] leading-[160%]"
                  style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                >
                  {description}
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <span
                  className="text-[#D8008D] leading-[160%]"
                  style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                >
                  {socialLabel}
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-[28px]">
                  {socialLinks.map((link, index) => (
                    <React.Fragment key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFFFFF8F] leading-[150%] transition-colors duration-300 hover:text-[#D8008D]"
                        style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                      >
                        {link.name}
                      </a>
                      {index < socialLinks.length - 1 && (
                        <span
                          className="text-[#72716D] leading-[150%]"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                        >
                          /
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <span
                  className="text-[#D8008D] leading-[160%]"
                  style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                >
                  {linksLabel}
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-[28px]">
                  {footerLinks.map((link, index) => (
                    <React.Fragment key={link.name}>
                      {link.url.startsWith('http') ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FFFFFF8F] leading-[150%] transition-colors duration-300 hover:text-[#D8008D]"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="text-[#FFFFFF8F] leading-[150%] transition-colors duration-300 hover:text-[#D8008D]"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                        >
                          {link.name}
                        </Link>
                      )}
                      {index < footerLinks.length - 1 && (
                        <span
                          className="text-[#72716D] leading-[150%]"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                        >
                          /
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src={bigLogoSrc} className="w-full" alt="" />
      </div>
    </footer>
  )
}

export default Footer

const ArrowUpIcon = () => {
  return (
    <svg
      width="108"
      height="121"
      viewBox="0 0 108 121"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 0L108 53.4077L100.394 60.9302L59.3783 20.3644V121H48.6218V20.3644L7.60599 60.9302L0 53.4077L54 0Z"
        fill="#CAC9C4"
      />
    </svg>
  )
}
