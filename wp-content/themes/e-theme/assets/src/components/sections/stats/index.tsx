'use client'

import { useTranslations } from 'next-intl'

const Stats = () => {
  const t = useTranslations()

  const topStats = [
    {
      value: t('stats.topStats.0.value'),
      description: t('stats.topStats.0.description'),
    },
    {
      value: t('stats.topStats.1.value'),
      description: t('stats.topStats.1.description'),
    },
    {
      value: t('stats.topStats.2.value'),
      description: t('stats.topStats.2.description'),
    },
    {
      value: t('stats.topStats.3.value'),
      description: t('stats.topStats.3.description'),
    },
  ]

  const bottomStats = [
    {
      value: t('stats.bottomStats.0.value'),
      description: t('stats.bottomStats.0.description'),
    },
    {
      value: t('stats.bottomStats.1.value'),
      description: t('stats.bottomStats.1.description'),
    },
    {
      value: t('stats.bottomStats.2.value'),
      description: t('stats.bottomStats.2.description'),
    },
  ]

  return (
    <section className="w-full relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="absolute top-1/2 w-full h-full left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="/assets/stats/gradientbg.webp" className="w-full h-full object-fill" alt="" />
      </div>
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-[56px] items-center">
          {/* Top row - 4 stats */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 lg:divide-x divide-black/30">
            {topStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col max-w-full lg:max-w-[304px] w-full gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4"
              >
                <h3 className="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]">
                  {stat.value}
                </h3>
                <p className="text-[13px] gradient-text sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%] opacity-[72%]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom row - 3 stats */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8 lg:gap-6">
            {bottomStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4"
              >
                <h3 className="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]">
                  {stat.value}
                </h3>
                <p
                  className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%] opacity-70"
                  style={{
                    background:
                      'linear-gradient(181deg, #FFFFFF 61.8%, #F4DCEC 96.62%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Dividers between bottom stats - desktop only */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-6 md:gap-8 lg:gap-6 w-full absolute bottom-0 pointer-events-none">
            <div className="h-20 border-r border-black/30" />
            <div className="h-20 border-r border-black/30" />
            <div className="h-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats
