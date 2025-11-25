'use client';

import { useTranslations } from "next-intl";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";

const HeroHeadline = () => {
  const openModal = useVoiceAgentModalStore((state) => state.openModal);
  const t = useTranslations();
  return (
    <div className="flex flex-row items-center gap-2 xs:gap-3 sm:gap-1 w-full">
      {/* Avatars section */}
      <div className="flex gap-1 xs:gap-2 sm:gap-[12px] md:gap-[16px]">
        <div className="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full border-[2px] xs:border-[3px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-[#000] overflow-hidden">
          <img src="/assets/hero/avatar/avatar1.webp" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full ml-[-25px] xs:ml-[-30px] sm:ml-[-32px] md:ml-[-38px] lg:ml-[-45px] border-[2px] xs:border-[3px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-[#000] overflow-hidden">
          <img src="/assets/hero/avatar/avatar2.webp" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px] lg:w-[83px] lg:h-[83px] rounded-full ml-[-25px] xs:ml-[-30px] sm:ml-[-32px] md:ml-[-38px] lg:ml-[-45px] bg-[#000] p-[2px] xs:p-1 avatar3-shadow overflow-hidden">
          <img
            src="/assets/hero/avatar/avatar3.webp"
            alt=""
            className="avatar-border w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Headline section with button */}
      <div className="gradient-border-mask pr-2 sm:pr-3 max-w-[1105px] w-full !flex items-center gap-2 sm:gap-3 md:gap-4 justify-between py-1 relative rounded-r-full !overflow-hidden flex-1 min-w-0">
        <div
          className="overflow-hidden absolute bottom-0 right-0 btn-gradeint-back"
          style={{
            width: "clamp(80px, 15vw, 151px)",
            height: "clamp(35px, 8vw, 50px)",
          }}
        />
        <div className="flex items-center gap-[6px] md:gap-[10px] relative whitespace-nowrap flex-shrink min-w-0">
          <span
            className="text-[#FFFFFF] font-medium leading-[120%] truncate"
            style={{ fontSize: "clamp(14px, 3vw, 64px)" }}
          >
            {t("hero.weDeliver")}
          </span>
          <span
            className="gradient-text leading-[120%] font-bold truncate"
            style={{ fontSize: "clamp(14px, 3vw, 64px)" }}
          >
            {t("hero.digitalEmployees")}
          </span>
        </div>

        <button
          className="flex relative items-center btn-shadow justify-center rounded-full bg-[rgba(255,17,172,0.64)] border-[0.5px] border-[#d8008d] transition-all hover:bg-[rgba(255,17,172,0.8)] active:scale-95 flex-shrink-0"
          aria-label="Learn more"
          onClick={openModal}
          style={{
            width: "clamp(40px, 7vw, 56px)",
            height: "clamp(40px, 7vw, 56px)",
          }}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-[60%] h-[60%]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66669 16H25.3334M25.3334 16L18.6667 9.33334M25.3334 16L18.6667 22.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroHeadline;
