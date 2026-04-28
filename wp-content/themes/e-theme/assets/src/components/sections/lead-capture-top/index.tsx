'use client';

import { useTranslations } from "next-intl";
import { useState } from "react";
import ChatButton from "../../ui/ChatButton";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import type { LeadCaptureTopData } from "@/types/blocks";

const FALLBACK_BANNER = '/assets/ctabanner.webp'
const FALLBACK_VIDEO = '/assets/interview-101.mp4'

interface Props { data?: LeadCaptureTopData }

const LeadCaptureTop = ({ data }: Props = {}) => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const part1 = data?.title_part1 || t("leadCapture.topSection.title.part1");
  const highlight = data?.title_highlight || t("leadCapture.topSection.title.highlight");
  const part2 = data?.title_part2 || t("leadCapture.topSection.title.part2");
  const description = data?.description || t("leadCapture.topSection.description");
  const banner = data?.banner?.url || FALLBACK_BANNER;
  const video = data?.video?.url || FALLBACK_VIDEO;
  const buttonLabel = data?.button?.label || undefined;
  const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;
  const buttonTarget = data?.button?.mode === 'url' ? (data.button.url?.target || '_self') : '_self';

  return (
    <section className="flex flex-col max-w-[1920px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-4 lg:pt-4">
      <CalendlyInline
        isOpen={showCalendly}
        onClose={() => setShowCalendly(false)}
        calendlyUrl={
          process.env.NEXT_PUBLIC_CALENDLY_URL ||
          "https://calendly.com/pg-aiconiq/30min"
        }
        onEventScheduled={() => setShowCalendly(false)}
      />
      <div className="w-full relative bg-[#1A1317] rounded-[8px] overflow-hidden">
        <div className="relative max-w-[1250px] w-full mx-auto py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-0">
          <img
            src={banner}
            alt=""
            className="absolute top-[-10px] mix-blend-lighten right-0 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] opacity-50 sm:opacity-70 md:opacity-100"
          />
          <video
            src={video}
            className="relative lg:absolute lg:right-0 lg:top-16 w-full lg:max-w-[50%] h-auto z-10 mb-6 lg:mb-0"
            autoPlay
            muted
            playsInline
            controls
          />
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 relative lg:max-w-[50%]">
            <h2 className="font-semibold w-full gradient-text text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-[120%]">
              {part1}{" "}<span className="text-gradient">{highlight}</span>{" "}{part2}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-4">
              <p className="w-full text-[#FFFFFF8F] font-bold text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
                {description}
              </p>
            </div>
            {buttonLabel && (
              buttonHref ? (
                <a
                  href={buttonHref}
                  target={buttonTarget}
                  rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  className="self-start"
                >
                  <ChatButton label={buttonLabel} />
                </a>
              ) : (
                <div className="self-start">
                  <ChatButton label={buttonLabel} onClick={() => setShowCalendly(true)} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureTop;
