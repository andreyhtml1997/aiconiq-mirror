'use client';

import { useTranslations } from "next-intl";
import ChatButton from "../../ui/ChatButton";
import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";

const ctabanner = '/assets/ctabanner.webp'
const avatar = '/assets/lead-img/avatar.webp'
const bg = '/assets/lead-img/bg.webp'

const LeadCapture = () => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);
  return (
    <section
      id="contact"
      className="flex flex-col max-w-[1920px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:p-4 gap-4 sm:gap-3 md:gap-2"
    >
      <CalendlyInline
        isOpen={showCalendly}
        onClose={() => setShowCalendly(false)}
        calendlyUrl={
          process.env.NEXT_PUBLIC_CALENDLY_URL ||
          "https://calendly.com/your-calendly-url"
        }
        onEventScheduled={(eventData) => {
          setShowCalendly(false);
        }}
      />
      <div className="w-full relative bg-[#1A1317] rounded-[8px] overflow-hidden">
        <div className="relative max-w-[1250px] w-full mx-auto py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-0">
          <img
            src={ctabanner}
            alt=""
            className="absolute top-[-10px] mix-blend-lighten right-0 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] opacity-50 sm:opacity-70 md:opacity-100"
          />
            
          <video
            src="/assets/interview-101.mp4"
            className="relative lg:absolute lg:right-0 lg:top-16 w-full lg:max-w-[50%] h-auto z-10 mb-6 lg:mb-0"
            autoPlay
            muted
            playsInline
            controls
          />
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 relative">
            <h2 className="font-semibold max-w-full sm:max-w-[500px] md:max-w-[552px] w-full gradient-text text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-[120%]">
              {t("leadCapture.topSection.title.part1")}{" "}
              <span className="text-gradient">
                {t("leadCapture.topSection.title.highlight")}
              </span>{" "}
              {t("leadCapture.topSection.title.part2")}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-4">
              <p className="max-w-full sm:max-w-[500px] md:max-w-[640px] lg:max-w-[740px] text-[#FFFFFF8F] font-bold text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
                {t("leadCapture.topSection.description")}
              </p>

              {/* <ChatButton
                label={t("leadCapture.topSection.button")}
                onClick={() => setShowCalendly(true)}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-full relative bg-[#1A1317] overflow-hidden rounded-[8px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[739px]"
        style={{
          background:
            "radial-gradient(70.67% 55.33% at 31.67% 57.87%, rgba(216, 0, 141, 0.24) 0%, rgba(216, 0, 141, 0.00) 100%), #1A1317",
        }}
      >
        <img
          src={bg}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 sm:opacity-60 md:opacity-100"
        />
        <div className="relative max-w-[1250px] w-full mx-auto flex flex-col lg:flex-row justify-between py-0 sm:py-10 md:py-12 lg:py-16 px-0 sm:px-6 md:px-8 lg:px-0">
          <div className="max-w-full lg:max-w-[800px] w-full relative order-2 lg:order-1 mt-6 lg:mt-0">
            <img
              src={avatar}
              alt=""
              className="w-full max-w-[600px] sm:max-w-[700px] lg:max-w-[800px] mx-auto lg:mx-0 relative lg:absolute lg:top-5 lg:left-0"
            />
          </div>

          <div className="max-w-full lg:max-w-[537px] relative p-4  items-start lg:top-[184px] w-full lg:pl-10 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:border-l border-[#D8008D] order-1 lg:order-2 pb-6 lg:pb-0">
            <h2 className="gradient-text font-medium text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%]">
              {t("leadCapture.bottomSection.title")}
            </h2>
            <ChatButton
              label={t("leadCapture.bottomSection.button")}
              onClick={() => setShowCalendly(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
