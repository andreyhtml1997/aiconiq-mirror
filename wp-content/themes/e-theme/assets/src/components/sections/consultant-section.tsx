'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ChatButton from "../ui/ChatButton";
import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import type { ConsultantSectionData } from "@/types/blocks";

const FALLBACK_LOGO = '/assets/consultant/consult-logo.webp'
const FALLBACK_BACK = '/assets/consultant/back-logo.svg'
const FALLBACK_AVAS = [
  '/assets/consultant/ava1.webp',
  '/assets/consultant/ava2.webp',
  '/assets/consultant/ava3.webp',
]
const ROTATIONS = [7, 2, -11]

interface Props {
  data?: ConsultantSectionData
}

const ConsultantSection = ({ data }: Props = {}) => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const title = data?.title || t("consultant.title");
  const buttonLabel = data?.button?.label || t("consultant.button");
  const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;
  const consultLogo = data?.consult_logo?.url || FALLBACK_LOGO;
  const backLogo = data?.back_logo?.url || FALLBACK_BACK;
  const avatars = data?.avatars?.length
    ? data.avatars.slice(0, 3).map((a) => a.url)
    : FALLBACK_AVAS;

  return (
    <section className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-[140px]">
      <div className="max-w-[1279px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[100px] px-4 sm:px-6 md:px-8">
        <div className="max-w-full sm:max-w-[500px] lg:max-w-[548px] w-full relative order-2 lg:order-1">
          <motion.div
            className="max-w-[508px] items-center justify-center w-full flex relative"
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(216, 0, 141, 1) 0%, rgba(216, 0, 141, 0) 70%)",
                filter: "blur(60px)",
                zIndex: -1,
              }}
              variants={{ initial: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
            <img
              src={backLogo}
              className="max-w-[250px] md:max-w-[424px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
              alt=""
            />
            {avatars.map((src, i) => {
              const positionClass = i === 0
                ? "absolute top-5 left-0 z-10"
                : i === 1
                ? "relative top-3 z-20"
                : "absolute top-5 right-0 z-10";
              return (
                <motion.img
                  key={i}
                  src={src}
                  className={`max-w-[170px] sm:max-w-[220px] w-full ${positionClass}`}
                  alt=""
                  variants={{ initial: { rotate: 0 }, hover: { rotate: ROTATIONS[i] ?? 0 } }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              );
            })}
          </motion.div>
        </div>
        <div className="max-w-full lg:max-w-[624px] w-full flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-start order-1 lg:order-2">
          <div className="flex flex-col gap-3 sm:gap-4">
            <img
              src={consultLogo}
              className="max-w-7 sm:max-w-8 w-full"
              alt=""
            />
            <h2 className="font-medium text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[120%] gradient-text">
              {title}
            </h2>
          </div>
          {buttonHref ? (
            <a href={buttonHref} target="_self"><ChatButton label={buttonLabel} /></a>
          ) : (
            <ChatButton label={buttonLabel} onClick={() => setShowCalendly(true)} />
          )}
        </div>
      </div>

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
    </section>
  );
};

export default ConsultantSection;
