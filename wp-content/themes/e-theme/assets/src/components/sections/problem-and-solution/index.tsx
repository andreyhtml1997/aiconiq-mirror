'use client';

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import ChatButton from "../../ui/ChatButton";
import { AiConiqCard } from "./AiConiqCard";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
import { useMixpanelTracking } from "@/hooks/analytics/useMixpanelTracking";
import type { ProblemSolutionData } from "@/types/blocks";

const FALLBACK_IMG1 = '/assets/problem/1.webp'
const FALLBACK_IMG2 = '/assets/problem/2.webp'
const checkIcon = '/assets/problem/check.svg'
const linesIcon = '/assets/problem/lines.svg'
const FALLBACK_ICON_CHATGPT = '/assets/problem/chatgpt.svg'
const FALLBACK_ICON_RAG = '/assets/problem/rag.svg'
const ellipsisIconBottom = '/assets/problem/ellisepbottom.webp'

interface Props {
  data?: ProblemSolutionData
}

const ProblemAndSolution = ({ data }: Props = {}) => {
  const openModal = useVoiceAgentModalStore((state) => state.openModal);
  const t = useTranslations();
  const { trackVoiceAgentButtonClicked } = useMixpanelTracking();

  const handleChatButtonClick = () => {
    trackVoiceAgentButtonClicked({
      source: 'problem_solution',
      page_path: window.location.pathname,
      referrer: document.referrer,
    });
    openModal();
  };

  const badge = data?.badge || t("problemAndSolution.badge");
  const middleWord = data?.middle_word || t("problemAndSolution.middleWord");
  const title = data?.title || t("problemAndSolution.title");
  const description1 = data?.description1 || t("problemAndSolution.description1");
  const description2 = data?.description2 || t("problemAndSolution.description2");
  const accuracyText = data?.accuracy_text || t("problemAndSolution.accuracyText");
  const chatButtonLabel = data?.cta?.label || t("problemAndSolution.chatButtonLabel");
  const ctaHref = data?.cta?.mode === 'url' ? data.cta.url?.url : undefined;
  const howItWorks = data?.how_it_works || t("problemAndSolution.howItWorks");

  // Card 1 — ChatGPT-style; Card 2 — RAG-style
  const card1 = data?.cards?.[0];
  const card2 = data?.cards?.[1];

  const card1Label = card1?.label || t("problemAndSolution.cards.chatgpt.label");
  const card1Icon = card1?.icon?.url || FALLBACK_ICON_CHATGPT;
  const card1Image = card1?.image?.url || FALLBACK_IMG1;
  const card1Features = card1?.features?.length
    ? card1.features
    : [t("problemAndSolution.cards.chatgpt.features.0"), t("problemAndSolution.cards.chatgpt.features.1")];
  const card1QL = card1?.quality_label || t("problemAndSolution.cards.chatgpt.qualityLabel");
  const card1QV = card1?.quality_value || t("problemAndSolution.cards.chatgpt.qualityValue");

  const card2Label = card2?.label || t("problemAndSolution.cards.rag.label");
  const card2Icon = card2?.icon?.url || FALLBACK_ICON_RAG;
  const card2Image = card2?.image?.url || FALLBACK_IMG2;
  const card2Features = card2?.features?.length
    ? card2.features
    : [t("problemAndSolution.cards.rag.features.0"), t("problemAndSolution.cards.rag.features.1")];
  const card2QL = card2?.quality_label || t("problemAndSolution.cards.rag.qualityLabel");
  const card2QV = card2?.quality_value || t("problemAndSolution.cards.rag.qualityValue");

  const v1Match = String(card1QV).match(/-?\d+/);
  const v2Match = String(card2QV).match(/-?\d+/);
  const target1 = v1Match ? parseInt(v1Match[0], 10) : 54;
  const target2 = v2Match ? parseInt(v2Match[0], 10) : 59;

  const { ref: firstCardRef, value: firstAnimatedValue } = useCountUpOnView({ target: target1, start: 0, duration: 1000, threshold: 0.1, once: false });
  const { ref: secondCardRef, value: secondAnimatedValue } = useCountUpOnView({ target: target2, start: 0, duration: 1500, threshold: 0.1, once: false });

  const card3 = data?.cards?.[2];

  return (
    <section
      id="solutions"
      className="flex items-center justify-center px-4 sm:px-6 md:px-8"
    >
      <div className="flex bg-[#141112] relative py-12 overflow-hidden sm:py-16 md:py-20 lg:py-[124px] rounded-[8px] w-full flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[124px] items-center justify-center">
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center px-4">
          <SectionHeader
            badge={badge}
            middleWord={middleWord}
            title={title}
            maxWidth="1200px"
          />
          <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center max-w-[1044px] w-full">
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">{description1}</p>
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">{description2}</p>
          </div>
        </div>
        <div className="flex flex-col max-w-[1200px] w-full mx-auto gap-8 sm:gap-10 md:gap-[42px] items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-[53px] w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-4 relative">
              {/* Card 1 */}
              <div className="border border-[#313131] bg-[#141112] rounded-2xl relative z-10">
                <div className="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#1A1919] border border-[#3A3A3AA3] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
                  <img src={card1Icon} alt="" className="max-w-3 sm:max-w-4" />
                  <span className="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]">{card1Label}</span>
                </div>
                <img src={card1Image} alt="" className="w-full" />
                <div className="flex flex-col">
                  {card1Features.map((feature, fi) => (
                    <div key={fi}>
                      <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                        <img src={checkIcon} alt="" className="w-[20px] sm:w-[24px] flex-shrink-0" />
                        <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">{feature}</span>
                      </div>
                      {fi < card1Features.length - 1 && (
                        <div className="w-full h-[0.5px]" style={{ background: "linear-gradient(90deg, rgba(150, 150, 150, 0.16) 0%, rgba(150, 150, 150, 0.5) 100%)" }} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between" style={{ background: "linear-gradient(87.47deg, rgba(65, 65, 65, 0.24) 31.41%, rgba(32, 26, 30, 0.24) 87.36%, rgba(21, 11, 17, 0.24) 101.12%)" }}>
                  <span className="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white">{card1QL}</span>
                  <span ref={firstCardRef} className="text-white font-semibold text-[48px] sm:text-[56px] md:text-[64px] leading-[120%]" role="text" aria-live="polite" aria-label={`${firstAnimatedValue}%`}>
                    {firstAnimatedValue}%
                  </span>
                  <img src={linesIcon} className="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full" alt="" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-[#313131] bg-[#141112] rounded-2xl relative z-10">
                <div className="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#1A1919] border border-[#3A3A3AA3] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
                  <img src={card2Icon} alt="" className="max-w-3 sm:max-w-4" />
                  <span className="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]">{card2Label}</span>
                </div>
                <img src={card2Image} alt="" className="w-full" />
                <div className="flex flex-col">
                  {card2Features.map((feature, fi) => (
                    <div key={fi}>
                      <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                        <img src={checkIcon} alt="" className="w-[20px] sm:w-[24px] flex-shrink-0" />
                        <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">{feature}</span>
                      </div>
                      {fi < card2Features.length - 1 && (
                        <div className="w-full h-[0.5px]" style={{ background: "linear-gradient(90deg, rgba(150, 150, 150, 0.16) 0%, rgba(150, 150, 150, 0.5) 100%)" }} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between" style={{ background: "linear-gradient(87.47deg, rgba(65, 65, 65, 0.24) 31.41%, rgba(32, 26, 30, 0.24) 87.36%, rgba(21, 11, 17, 0.24) 101.12%)" }}>
                  <span className="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white">{card2QL}</span>
                  <span ref={secondCardRef} className="text-white font-semibold text-[48px] sm:text-[56px] md:text-[64px] leading-[120%]" role="text" aria-live="polite" aria-label={`${secondAnimatedValue}%`}>
                    {secondAnimatedValue}%
                  </span>
                  <img src={linesIcon} className="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full" alt="" />
                </div>
              </div>

              <AiConiqCard card={card3} />

              <img src={ellipsisIconBottom} className="hidden lg:block absolute bottom-[-69%] right-[-31%]" alt="" />
            </div>

            <p className="max-w-[414px] w-full text-white font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] text-center px-4">
              {accuracyText}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10 md:gap-[57px] items-center justify-center">
            {ctaHref ? (
              <a href={ctaHref} target="_self"><ChatButton label={chatButtonLabel} /></a>
            ) : (
              <ChatButton label={chatButtonLabel} onClick={handleChatButtonClick} />
            )}
            <span className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">{howItWorks}</span>
          </div>
        </div>

        <div className="hidden lg:block absolute top-0 right-[5%] max-w-[700px] w-[678px] h-[1400px]">
          <div style={{ position: "absolute", width: "54px", height: "799px", left: "300px", top: "300px", background: "#FF21B2", opacity: 0.88, filter: "blur(150px)", borderRadius: "50%", transform: "rotate(-1deg)" }} />
        </div>
      </div>
    </section>
  );
};

export default ProblemAndSolution;
