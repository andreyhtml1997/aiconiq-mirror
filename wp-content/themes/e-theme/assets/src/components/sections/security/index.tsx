'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import SectionHeader from '../../ui/SectionHeader'
import { SecurityCard } from './SecurityCard'
import { MobileSecurityCard } from './MobileSecurityCard'
import type { SecurityData } from '@/types/blocks'

const FALLBACK_IMAGES = [
  '/assets/security/card1.webp',
  '/assets/security/card2.webp',
  '/assets/security/card3.webp',
  '/assets/security/card4.webp',
  '/assets/security/card5.webp',
]

const cardImageUrl = (cards: SecurityData['cards'] | null | undefined, i: number): string =>
  cards?.[i]?.image?.url || FALLBACK_IMAGES[i] || FALLBACK_IMAGES[0]

interface Props {
  data?: SecurityData
}

const Security = ({ data }: Props = {}) => {
  const t = useTranslations()
  const [activeIndex, setActiveIndex] = useState(0)

  const badge = data?.badge || t("security.badge")
  const title = data?.title || t("security.title")
  const description1 = data?.description1 || t("security.description1")
  const description2 = data?.description2 || t("security.description2")

  const cards = data?.cards?.length ? data.cards : null
  const numCards = cards?.length || 5
  const activeImage = cardImageUrl(cards, activeIndex)

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[80px]">
      <img src="/assets/gradient-line.webp" alt="" className="mx-auto" />

      <div className="max-w-[1280px] mt-20 w-full mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-full lg:max-w-[1036px] w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
          <SectionHeader
            badge={badge}
            title={title}
            className="!items-start !justify-start !text-left !w-full"
            textClassName="!mx-0 !text-left"
            maxWidth="100%"
          />
          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {description1}
            </p>
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {description2}
            </p>
          </div>
        </div>

        {/* Desktop layout - sticky image on right */}
        <div className="hidden lg:flex w-full items-start justify-between gap-12">
          <div className="flex flex-col w-auto">
            {Array.from({ length: numCards }).map((_, i) => (
              <SecurityCard
                key={i}
                index={i}
                setActiveIndex={setActiveIndex}
                images={[]}
                isMobile={false}
                card={cards?.[i]}
              />
            ))}
          </div>

          <div className="max-w-[519px] !sticky top-10 w-full p-2">
            <div
              className="w-full rounded-[16px] p-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, #D8008D 0%, rgba(216, 0, 141, 0) 100%)",
              }}
            >
              <div className="w-full h-full rounded-[16px] overflow-hidden bg-black">
                <motion.img
                  key={activeIndex}
                  src={activeImage}
                  alt=""
                  className="w-full h-auto"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout - image below each card */}
        <div className="flex lg:hidden flex-col w-full gap-10 sm:gap-12">
          {Array.from({ length: numCards }).map((_, i) => (
            <MobileSecurityCard
              key={i}
              index={i}
              imageUrl={cardImageUrl(cards, i)}
              card={cards?.[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security
