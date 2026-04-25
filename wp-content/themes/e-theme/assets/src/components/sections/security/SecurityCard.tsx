'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { SecurityCardData } from '@/types/blocks'

interface SecurityCardProps {
  index: number
  setActiveIndex: (index: number) => void
  images: string[]
  isMobile: boolean
  card?: SecurityCardData
}

export const SecurityCard = ({ index, setActiveIndex, card }: SecurityCardProps) => {
  const t = useTranslations()
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, {
    margin: '-50% 0px -50% 0px',
  })

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index)
    }
  }, [isInView, index, setActiveIndex])

  const title = card?.title || t(`security.cards.${index}.title`)
  const description = card?.description || t(`security.cards.${index}.description`)
  const badge = card
    ? (card.badge || undefined)
    : (t.has(`security.cards.${index}.badge`) ? t(`security.cards.${index}.badge`) : undefined)
  const highlight = card
    ? (card.highlight || undefined)
    : (t.has(`security.cards.${index}.highlight`) ? t(`security.cards.${index}.highlight`) : undefined)

  return (
    <motion.div
      ref={cardRef}
      className="max-w-full lg:max-w-[519px] w-full flex flex-col gap-5 sm:gap-6 md:gap-8 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[680px] py-4 sm:py-6 lg:py-0"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isInView ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="gradient-text font-semibold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[120%]">
        {title}
      </h3>
      <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
        {description}
      </p>

      {badge && highlight && (
        <div className="bg-[#1A1317] rounded-[8px] p-4 sm:p-5 md:p-6 items-start flex flex-col gap-3 sm:gap-4">
          <div className="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
            <span className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {badge}
            </span>
          </div>
          <p className="gradient-text text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
            {highlight}
          </p>
        </div>
      )}
    </motion.div>
  )
}
