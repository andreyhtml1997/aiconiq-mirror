'use client'

import { useTranslations } from 'next-intl'
import { useState } from "react";
import ChatButton from '../../ui/ChatButton'
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import type { SolutionsOverviewData } from "@/types/blocks";

const FALLBACK_ICONS = [
  '/assets/solutions-icons/1.svg',
  '/assets/solutions-icons/2.svg',
  '/assets/solutions-icons/3.svg',
  '/assets/solutions-icons/4.svg',
]

interface Props {
  data?: SolutionsOverviewData
}

const SolutionsOverview = ({ data }: Props = {}) => {
  const t = useTranslations()
  const [showCalendly, setShowCalendly] = useState(false);

  const title = data?.title || t('solutionsOverview.title');
  const buttonLabel = data?.button?.label || t('solutionsOverview.buttonLabel');
  const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;

  const solutions = data?.solutions?.length
    ? data.solutions.map((s, i) => ({
        icon: s.icon?.url || FALLBACK_ICONS[i] || FALLBACK_ICONS[0],
        title: s.title,
        description: s.description,
      }))
    : [0, 1, 2, 3].map((i) => ({
        icon: FALLBACK_ICONS[i],
        title: t(`solutionsOverview.solutions.${i}.title`),
        description: t(`solutionsOverview.solutions.${i}.description`),
      }))

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[130px]">
      <CalendlyInline
        isOpen={showCalendly}
        onClose={() => setShowCalendly(false)}
        calendlyUrl={
          process.env.NEXT_PUBLIC_CALENDLY_URL ||
          "https://calendly.com/pg-aiconiq/30min"
        }
        onEventScheduled={() => {
          setShowCalendly(false);
        }}
      />
      <div className="max-w-[1280px] w-full mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] gradient-text leading-[120%] max-w-full lg:max-w-[1036px] w-full">
            {title}
          </h2>
          {buttonHref ? (
            <a href={buttonHref} target="_self"><ChatButton label={buttonLabel} /></a>
          ) : (
            <ChatButton label={buttonLabel} onClick={() => setShowCalendly(true)} />
          )}
        </div>
        <div className="w-full border-t border-[#D9D9D9]/[24%]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-[#1A1317] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] min-h-[180px] sm:min-h-[190px] md:min-h-[204px] p-5 sm:p-6 md:p-8 flex items-center justify-center gap-3 sm:gap-4 flex-col text-center relative group transition-transform duration-300"
            >
              <div
                className="absolute inset-0 rounded-[12px] sm:rounded-[14px] md:rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(95deg, rgba(118, 22, 85, 0.24) -4.88%, rgba(230, 54, 169, 0.24) 74.86%, rgba(254, 109, 203, 0.24) 94.48%)',
                }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div
                  className="w-[244px] h-[130px] rounded-[24px]"
                  style={{
                    background: 'rgba(202, 10, 135, 0.64)',
                    filter: 'blur(45px)',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              <img
                src={solution.icon}
                alt=""
                className="max-w-7 sm:max-w-8 relative z-10"
              />
              <span className="text-white font-extrabold text-[18px] sm:text-[19px] md:text-[20px] leading-[120%] relative z-10">
                {solution.title}
              </span>
              <p className="text-white/[72%] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%] relative z-10">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SolutionsOverview
