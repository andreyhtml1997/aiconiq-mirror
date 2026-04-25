'use client';

import { useTranslations } from "next-intl";
import ChatButton from "../../ui/ChatButton";
import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import type { CompetitiveAdvantageHeroData } from "@/types/blocks";

const FALLBACK_LOGO = '/assets/logo-con.webp'
const FALLBACK_BANNER = '/assets/banner-con.webp'

interface Props {
  data?: CompetitiveAdvantageHeroData
}

const CompetitiveAdvantageHero = ({ data }: Props = {}) => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const title = data?.title || t("competitiveAdvantageHero.title");
  const description = data?.description || t("competitiveAdvantageHero.description");
  const buttonLabel = data?.button?.label || t("competitiveAdvantageHero.buttonLabel");
  const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;
  const logoSrc = data?.logo?.url || FALLBACK_LOGO;
  const bannerSrc = data?.banner?.url || FALLBACK_BANNER;

  return (
    <section className="py-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[80px] px-4">
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
      <div className="max-w-[1280px] w-full mx-auto rounded-[12px] sm:rounded-[14px] md:rounded-[16px] competitive-advantage-hero py-8 sm:py-10 md:py-12 lg:py-[58px] px-6 sm:px-8 md:px-12 lg:px-16 xl:pl-[104px] relative overflow-hidden">
        <img
          src={bannerSrc}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-70 sm:opacity-80 md:opacity-100"
          alt=""
        />
        <img
          src={logoSrc}
          className="max-w-[60px] sm:max-w-[65px] md:max-w-[75px] w-full relative mb-6 sm:mb-7 md:mb-8"
          alt=""
        />
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-start relative">
          <h2 className="gradient-text font-medium max-w-[800px] w-full text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[120%]">
            {title}
          </h2>
          <p className="max-w-full sm:max-w-[480px] md:max-w-[549px] w-full text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
            {description}
          </p>
          {buttonHref ? (
            <a href={buttonHref} target="_self"><ChatButton label={buttonLabel} /></a>
          ) : (
            <ChatButton label={buttonLabel} onClick={() => setShowCalendly(true)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default CompetitiveAdvantageHero;
