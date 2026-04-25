'use client'

import { useTranslations } from 'next-intl'
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { extractNumericParts } from "@/utils/format/extractNumericParts";
import { useMemo } from "react";
import type { StatsData } from "@/types/blocks";

interface Props {
  data?: StatsData
}

const Stats = ({ data }: Props = {}) => {
  const t = useTranslations()

  const rawTopStats = useMemo(() => {
    if (data?.top_stats?.length) {
      return data.top_stats.slice(0, 4).map((s) => s.value || '');
    }
    return [
      t('stats.topStats.0.value'),
      t('stats.topStats.1.value'),
      t('stats.topStats.2.value'),
      t('stats.topStats.3.value'),
    ];
  }, [data, t]);

  const rawBottomStats = useMemo(() => {
    if (data?.bottom_stats?.length) {
      return data.bottom_stats.slice(0, 4).map((s) => s.value || '');
    }
    return [
      t('stats.bottomStats.0.value'),
      t('stats.bottomStats.1.value'),
      t('stats.bottomStats.2.value'),
    ];
  }, [data, t]);

  const topDescriptions = useMemo(() => {
    if (data?.top_stats?.length) {
      return data.top_stats.slice(0, 4).map((s) => s.description || '');
    }
    return [
      t('stats.topStats.0.description'),
      t('stats.topStats.1.description'),
      t('stats.topStats.2.description'),
      t('stats.topStats.3.description'),
    ];
  }, [data, t]);

  const bottomDescriptions = useMemo(() => {
    if (data?.bottom_stats?.length) {
      return data.bottom_stats.slice(0, 4).map((s) => s.description || '');
    }
    return [
      t('stats.bottomStats.0.description'),
      t('stats.bottomStats.1.description'),
      t('stats.bottomStats.2.description'),
    ];
  }, [data, t]);

  const parsedTopStats = useMemo(() =>
    rawTopStats.map(value => extractNumericParts(value || '')), [rawTopStats]
  );

  const parsedBottomStats = useMemo(() =>
    rawBottomStats.map(value => extractNumericParts(value || '')), [rawBottomStats]
  );

  const topStat1 = useCountUpOnView({ target: parsedTopStats[0]?.magnitude || 0, start: 0, duration: 1900, threshold: 0.1, once: false });
  const topStat2 = useCountUpOnView({ target: parsedTopStats[1]?.magnitude || 0, start: 0, duration: 2500, threshold: 0.1, once: false });
  const topStat3 = useCountUpOnView({ target: parsedTopStats[2]?.magnitude || 0, start: 0, duration: 700, threshold: 0.1, once: false });
  const topStat4 = useCountUpOnView({ target: parsedTopStats[3]?.magnitude || 0, start: 0, duration: 1200, threshold: 0.1, once: false });

  const bottomStat1 = useCountUpOnView({ target: parsedBottomStats[0]?.magnitude || 0, start: 0, duration: 1400, threshold: 0.1, once: false });
  const bottomStat2 = useCountUpOnView({ target: parsedBottomStats[1]?.magnitude || 0, start: 0, duration: 2900, threshold: 0.1, once: false });
  const bottomStat3 = useCountUpOnView({ target: parsedBottomStats[2]?.magnitude || 0, start: 0, duration: 300, threshold: 0.1, once: false });
  const bottomStat4 = useCountUpOnView({ target: parsedBottomStats[3]?.magnitude || 0, start: 0, duration: 1100, threshold: 0.1, once: false });

  const topStatAnimations = [topStat1, topStat2, topStat3, topStat4];
  const bottomStatAnimations = [bottomStat1, bottomStat2, bottomStat3, bottomStat4];

  const topStats = useMemo(() => parsedTopStats.map((p, i) => ({
    description: topDescriptions[i] || '',
    parsed: p,
  })), [parsedTopStats, topDescriptions]);

  const bottomStats = useMemo(() => parsedBottomStats.map((p, i) => ({
    description: bottomDescriptions[i] || '',
    parsed: p,
  })), [parsedBottomStats, bottomDescriptions]);

  return (
    <section className="w-full relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="absolute top-1/2 w-full h-full left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="/assets/stats/gradientbg.webp" className="w-full h-full object-fill" alt="" />
      </div>
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-[56px] items-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 lg:divide-x divide-black/30">
            {topStats.map((stat, index) => {
              const { ref, value: animatedValue } = topStatAnimations[index];
              const { prefix, suffix, ariaLabel } = stat.parsed;

              return (
                <div
                  key={index}
                  className="flex flex-col max-w-full lg:max-w-[304px] w-full gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4"
                >
                  <div
                    ref={ref as any}
                    className="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]"
                    role="text"
                    aria-live="polite"
                    aria-label={ariaLabel}
                  >
                    <span aria-hidden="true">{prefix}</span>
                    <span aria-hidden="true">{animatedValue}</span>
                    <span aria-hidden="true">{suffix}</span>
                  </div>
                  <p className="text-[13px] gradient-text sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%] opacity-[72%]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={`w-full grid grid-cols-1 ${bottomStats.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-8 sm:gap-6 md:gap-8 lg:gap-6`}>
            {bottomStats.map((stat, index) => {
              const { ref, value: animatedValue } = bottomStatAnimations[index];
              const { prefix, suffix, ariaLabel } = stat.parsed;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 sm:gap-3 items-center justify-center text-center px-4 sm:px-3 md:px-4"
                >
                  <h3
                    ref={ref as any}
                    className="font-medium text-[#E8C5DD] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] leading-[120%]"
                    role="text"
                    aria-live="polite"
                    aria-label={ariaLabel}
                  >
                    <span aria-hidden="true">{prefix}</span>
                    <span aria-hidden="true">{animatedValue}</span>
                    <span aria-hidden="true">{suffix}</span>
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
              );
            })}
          </div>

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
