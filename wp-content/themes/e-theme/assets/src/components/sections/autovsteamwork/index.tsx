"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import SectionHeader from "../../ui/SectionHeader";
import ChatButton from "../../ui/ChatButton";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { useMixpanelTracking } from "@/hooks/analytics/useMixpanelTracking";
import type { AutoVsCardsData } from "@/types/blocks";

interface Props {
  data?: AutoVsCardsData
}

const AutoVSteamWork = ({ data }: Props = {}) => {
  const openModal = useVoiceAgentModalStore((state) => state.openModal);
  const t = useTranslations();
  const { trackVoiceAgentButtonClicked } = useMixpanelTracking();

  const handleChatButtonClick = () => {
    trackVoiceAgentButtonClicked({
      source: 'auto_vs_teamwork',
      page_path: window.location.pathname,
      referrer: document.referrer
    });
    openModal();
  };

  // Top-level
  const badge = data?.badge || t("autoVSteamWork.badge");
  const middleWord = data?.middle_word || t("autoVSteamWork.middleWord");
  const title = data?.title || t("autoVSteamWork.title");
  const description = data?.description || t("autoVSteamWork.description");

  // Automation
  const a = data?.automation;
  const aBadge = a?.badge || t("autoVSteamWork.automation.badge");
  const aHeading = a?.heading || t("autoVSteamWork.automation.heading");
  const aDescription = a?.description || t("autoVSteamWork.automation.description");
  const aUseCasesTitle = a?.use_cases_title || t("autoVSteamWork.automation.useCases.title");
  const aUseCases = a?.use_cases?.length ? a.use_cases : [
    t("autoVSteamWork.automation.useCases.reporting"),
    t("autoVSteamWork.automation.useCases.dataMaintenance"),
    t("autoVSteamWork.automation.useCases.meetingProtocols"),
    t("autoVSteamWork.automation.useCases.scheduling"),
  ];
  const aExTitle = a?.example_title || t("autoVSteamWork.automation.example.title");
  const aExP1 = a?.example_p1 || t("autoVSteamWork.automation.example.paragraph1");
  const aExP2 = a?.example_p2 || t("autoVSteamWork.automation.example.paragraph2");
  const aExRL = a?.result_label || t("autoVSteamWork.automation.example.resultLabel");
  const aExRV = a?.result_value || t("autoVSteamWork.automation.example.resultValue");
  const aExRD = a?.result_description || t("autoVSteamWork.automation.example.resultDescription");
  const aExIcon = a?.result_icon?.url || '/assets/auto/icon1.webp';

  // Collaboration
  const c = data?.collaboration;
  const cBadge = c?.badge || t("autoVSteamWork.collaboration.badge");
  const cHeading = c?.heading || t("autoVSteamWork.collaboration.heading");
  const cDescription = c?.description || t("autoVSteamWork.collaboration.description");
  const cUseCasesTitle = c?.use_cases_title || t("autoVSteamWork.collaboration.useCases.title");
  const cUseCases = c?.use_cases?.length ? c.use_cases : [
    t("autoVSteamWork.collaboration.useCases.strategy"),
    t("autoVSteamWork.collaboration.useCases.decisionSupport"),
    t("autoVSteamWork.collaboration.useCases.innovation"),
    t("autoVSteamWork.collaboration.useCases.marketing"),
  ];
  const cExTitle = c?.example_title || t("autoVSteamWork.collaboration.example.title");
  const cExParagraph = c?.example_paragraph || t("autoVSteamWork.collaboration.example.paragraph");
  const cExCT = c?.conclusion_title || t("autoVSteamWork.collaboration.example.conclusionTitle");
  const cExCX = c?.conclusion_text || t("autoVSteamWork.collaboration.example.conclusionText");
  const cCtaHref = c?.cta?.mode === 'url' ? c.cta.url?.url : undefined;
  const cCtaLabel = c?.cta?.label || undefined;

  const resultValue = useMemo(() => {
    const parsed = parseFloat(aExRV);
    return isNaN(parsed) ? 0 : parsed;
  }, [aExRV]);
  const { ref: countUpRef, value: animatedValue } = useCountUpOnView({
    target: resultValue, start: 0, duration: 500, threshold: 0.5, once: false,
  });

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[100px]">
      <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeader badge={badge} middleWord={middleWord} />
        <h2
          className={`gradient-text font-medium text-[48px] leading-[120%] text-center w-full mx-auto`}
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          <span className="font-bold">{title.split(" ")[0]}</span>{" "}
          <span>{title.split(" ").slice(1).join(" ")}</span>
        </h2>
        <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] max-w-[1063px]">
          {description}
        </p>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 justify-center flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12">
        {/* Automation */}
        <div className="bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
          <div className="p-2 flex flex-col gap-6 sm:gap-8 h-full items-start">
            <div className="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[16px] leading-[160%]">{aBadge}</span>
            </div>
            <h2 className="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]">{aHeading}</h2>
            <p className="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">{aDescription}</p>
            <div className="w-full border-t border-[#281A23]"></div>
            <div className="p-2 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">{aUseCasesTitle}</h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                {aUseCases.map((uc, i) => (
                  <div key={i} className="pl-2 flex gap-3 items-start">
                    <img src="/assets/problem/check.svg" alt="" className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5" />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">{uc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col w-full">
              <div
                className="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                style={{
                  background:
                    "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
                }}
              >
                <span className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">{aExTitle}</span>
              </div>
              <div className="py-6 sm:py-8 px-3 sm:px-4">
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">{aExP1}{" "}</p>
                <br />
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">{aExP2}</p>
              </div>

              <div
                className="rounded-[4px] relative overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                style={{
                  border: "0.5px solid transparent",
                  background:
                    "linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179, 77, 143, 0) 0%, rgba(179, 77, 143, 0.16) 100%) border-box",
                }}
              >
                <img src="/assets/lines.svg" className="absolute top-0 right-0 hidden sm:block" alt="" />
                <div className="flex flex-col gap-3 sm:gap-4">
                  <img src={aExIcon} alt="" className="max-w-[60px] sm:max-w-[75px] w-full" />
                  <span className="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]">{aExRL}</span>
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0">
                  <span className="text-[#FFFFFF] flex font-semibold text-[60px] sm:text-[80px] md:text-[100.24px] leading-[120%]">
                    <span ref={countUpRef} aria-live="polite">{animatedValue}</span>{" "}
                    <span className="text-gradient">%</span>
                  </span>
                  <div className="sm:p-3">
                    <p className="text-[#FFFFFF8F] font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[160%]">{aExRD}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration */}
        <div className="bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
          <div className="p-2 flex flex-col gap-6 sm:gap-8 items-start h-full">
            <div className="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[16px] leading-[160%]">{cBadge}</span>
            </div>
            <h2 className="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]">{cHeading}{" "}</h2>
            <p className="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">{cDescription}</p>
            <div className="w-full border-t border-[#281A23]"></div>
            <div className="p-2 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">{cUseCasesTitle}</h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                {cUseCases.map((uc, i) => (
                  <div key={i} className="pl-2 flex gap-3 items-start">
                    <img src="/assets/problem/check.svg" alt="" className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5" />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">{uc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col">
              <div
                className="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                style={{
                  background:
                    "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
                }}
              >
                <span className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">{cExTitle}</span>
              </div>
              <div className="py-6 sm:py-8 px-3 sm:px-4">
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">{cExParagraph}</p>
                <br />
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]"></p>
              </div>

              <div
                className="rounded-[4px] relative items-start overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                style={{
                  border: "0.5px solid transparent",
                  background:
                    "linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179, 77, 143, 0) 0%, rgba(179, 77, 143, 0.16) 100%) border-box",
                }}
              >
                <img src="/assets/lines.svg" className="absolute top-0 right-0 hidden sm:block" alt="" />
                <div className="flex flex-col gap-2 sm:gap-3">
                  <span className="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]">{cExCT}</span>
                </div>
                <p className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">{cExCX}</p>
                {cCtaHref ? (
                  <a href={cCtaHref} target="_self"><ChatButton label={cCtaLabel} /></a>
                ) : (
                  <ChatButton label={cCtaLabel} onClick={handleChatButtonClick} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoVSteamWork;
