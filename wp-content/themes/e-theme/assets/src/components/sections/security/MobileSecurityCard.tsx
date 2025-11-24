'use client'

import { useTranslations } from 'next-intl'

interface MobileSecurityCardProps {
  index: number
  images: string[]
}

export const MobileSecurityCard = ({ index, images }: MobileSecurityCardProps) => {
  const t = useTranslations()

  // Access translation keys directly using index
  const title = t(`security.cards.${index}.title`)
  const description = t(`security.cards.${index}.description`)

  // Optional fields - use t.has() to check if key exists before accessing
  const hasBadge = t.has(`security.cards.${index}.badge`)
  const hasHighlight = t.has(`security.cards.${index}.highlight`)

  const badge = hasBadge ? t(`security.cards.${index}.badge`) : undefined
  const highlight = hasHighlight ? t(`security.cards.${index}.highlight`) : undefined

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full">
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
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
      </div>

      <div className="max-w-full sm:max-w-[600px] mx-auto w-full border border-[#D8008D] rounded-[12px] sm:rounded-[16px] overflow-hidden">
        <img src={images[index]} alt="" className="w-full h-auto" />
      </div>
    </div>
  )
}
