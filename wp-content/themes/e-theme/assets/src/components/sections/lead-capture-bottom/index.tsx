'use client';

import { useTranslations } from "next-intl";
import ChatButton from "../../ui/ChatButton";
import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import type { LeadCaptureBottomData } from "@/types/blocks";

const FALLBACK_AVATAR = '/assets/lead-img/avatar.webp'
const FALLBACK_BG = '/assets/lead-img/bg.webp'

interface Props { data?: LeadCaptureBottomData }

const LeadCaptureBottom = ({ data }: Props = {}) => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const title = data?.title || t("leadCapture.bottomSection.title");
  const buttonLabel = data?.button?.label || t("leadCapture.bottomSection.button");
  const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;
  const image = data?.image?.url || FALLBACK_AVATAR;
  const background = data?.background?.url || FALLBACK_BG;

  return (
    <section
      id="contact"
      className="flex flex-col max-w-[1920px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:p-4"
    >
      <CalendlyInline
        isOpen={showCalendly}
        onClose={() => setShowCalendly(false)}
        calendlyUrl={
          process.env.NEXT_PUBLIC_CALENDLY_URL ||
          "https://calendly.com/pg-aiconiq/30min"
        }
        onEventScheduled={() => setShowCalendly(false)}
      />
      <div
        className="w-full relative bg-[#1A1317] overflow-hidden rounded-[8px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[739px]"
        style={{
          background:
            "radial-gradient(70.67% 55.33% at 31.67% 57.87%, rgba(216, 0, 141, 0.24) 0%, rgba(216, 0, 141, 0.00) 100%), #1A1317",
        }}
      >
        <img
          src={background}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 sm:opacity-60 md:opacity-100"
        />
        <div className="relative max-w-[1250px] w-full mx-auto flex flex-col lg:flex-row justify-between py-0 sm:py-10 md:py-12 lg:py-16 px-0 sm:px-6 md:px-8 lg:px-0">
          <div className="max-w-full lg:max-w-[800px] w-full relative order-2 lg:order-1 mt-6 lg:mt-0">
            <img
              src={image}
              alt=""
              className="w-full max-w-[600px] sm:max-w-[700px] lg:max-w-[800px] mx-auto lg:mx-0 relative lg:absolute lg:top-5 lg:left-0"
            />
          </div>

          <div className="max-w-full lg:max-w-[537px] relative p-4 items-start lg:top-[184px] w-full lg:pl-10 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:border-l border-[#D8008D] order-1 lg:order-2 pb-6 lg:pb-0">
            <h2 className="gradient-text font-medium text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%]">
              {title}
            </h2>
            {buttonHref ? (
              <a href={buttonHref} target="_self"><ChatButton label={buttonLabel} /></a>
            ) : (
              <ChatButton label={buttonLabel} onClick={() => setShowCalendly(true)} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureBottom;
