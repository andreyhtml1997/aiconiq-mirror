'use client';

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import ChatButton from "../../ui/ChatButton";
import { AiConiqCard } from "./AiConiqCard";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";

import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
const img1 = '/assets/problem/1.webp'
const img2 = '/assets/problem/2.webp'
const checkIcon = '/assets/problem/check.svg'
const linesIcon = '/assets/problem/lines.svg'
const chatgptIcon = '/assets/problem/chatgpt.svg'
const ragIcon = '/assets/problem/rag.svg'
const ellipsisIconBottom = '/assets/problem/ellisepbottom.webp'


const ProblemAndSolution = () => {
  const openModal = useVoiceAgentModalStore((state) => state.openModal);
  const t = useTranslations();

  // Card configurations with percentage values
  const percentageCards = [
    { value: 54 },
    { value: 59 }
  ];

  // Set up count-up animations for percentage values
  const { ref: firstCardRef, value: firstAnimatedValue } = useCountUpOnView({
    target: percentageCards[0].value,
    start: 0,
    duration: 1000,
    threshold: 0.1,
    once: false,
  });

  const { ref: secondCardRef, value: secondAnimatedValue } = useCountUpOnView({
    target: percentageCards[1].value,
    start: 0,
    duration: 1500,
    threshold: 0.1,
    once: false,
  });

  return (
    <section
      id="solutions"
      className="flex items-center justify-center px-4 sm:px-6 md:px-8"
    >
      <div className="flex bg-[#141112] relative py-12 overflow-hidden sm:py-16 md:py-20 lg:py-[124px] rounded-[8px] w-full flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[124px] items-center justify-center">
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center px-4">
          <SectionHeader
            badge={t("problemAndSolution.badge")}
            middleWord={t("problemAndSolution.middleWord")}
            title={t("problemAndSolution.title")}
            maxWidth="1200px"
          />
          <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center max-w-[1044px] w-full">
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {t("problemAndSolution.description1")}
            </p>
            <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%]">
              {t("problemAndSolution.description2")}
            </p>
          </div>
        </div>
        <div className="flex flex-col max-w-[1200px] w-full mx-auto gap-8 sm:gap-10 md:gap-[42px] items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-[53px] w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-4 relative">
              <div className="border border-[#313131] bg-[#141112] rounded-2xl relative z-10">
                <div className="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#1A1919] border border-[#3A3A3AA3] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
                  <img
                    src={chatgptIcon}
                    alt=""
                    className="max-w-3 sm:max-w-4"
                  />
                  <span className="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]">
                    ChatGPT
                  </span>
                </div>
                <img src={img1} alt="" className="w-full" />

                <div className="flex flex-col">
                  <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                    <img
                      src={checkIcon}
                      alt=""
                      className="w-[20px] sm:w-[24px] flex-shrink-0"
                    />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">
                      LLM Knowledge
                    </span>
                  </div>
                  <div
                    className="w-full h-[0.5px]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(150, 150, 150, 0.16) 0%, rgba(150, 150, 150, 0.5) 100%)",
                    }}
                  ></div>
                  <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                    <img
                      src={checkIcon}
                      alt=""
                      className="w-[20px] sm:w-[24px] flex-shrink-0"
                    />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">
                      Explicit
                    </span>
                  </div>
                </div>

                <div
                  className="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between"
                  style={{
                    background:
                      "linear-gradient(87.47deg, rgba(65, 65, 65, 0.24) 31.41%, rgba(32, 26, 30, 0.24) 87.36%, rgba(21, 11, 17, 0.24) 101.12%)",
                  }}
                >
                  <span className="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white">
                    QUALITY OF ADVICE / CONSULT
                  </span>
                  <span
                    ref={firstCardRef}
                    className="text-white font-semibold text-[48px] sm:text-[56px] md:text-[64px] leading-[120%]"
                    role="text"
                    aria-live="polite"
                    aria-label={`${firstAnimatedValue}%`}
                  >
                    {firstAnimatedValue}%
                  </span>

                  <img
                    src={linesIcon}
                    className="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full"
                    alt=""
                  />
                </div>
              </div>

              <div className="border border-[#313131] bg-[#141112] rounded-2xl relative z-10">
                <div className="absolute -top-[20px] sm:-top-[26px] left-1/2 -translate-x-1/2 bg-[#1A1919] border border-[#3A3A3AA3] rounded-full py-2 sm:py-3 px-6 sm:px-8 flex items-center justify-center gap-2">
                  <img src={ragIcon} alt="" className="max-w-3 sm:max-w-4" />
                  <span className="text-[#F5F1EE] text-[13px] sm:text-[14px] leading-[120%]">
                    RAG
                  </span>
                </div>
                <img src={img2} alt="" className="w-full" />

                <div className="flex flex-col">
                  <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                    <img
                      src={checkIcon}
                      alt=""
                      className="w-[20px] sm:w-[24px] flex-shrink-0"
                    />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">
                      Corporate Knowledge / Domain Knowledge
                    </span>
                  </div>
                  <div
                    className="w-full h-[0.5px]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(150, 150, 150, 0.16) 0%, rgba(150, 150, 150, 0.5) 100%)",
                    }}
                  ></div>
                  <div className="bg-[#1D1B1C] items-center pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 flex gap-2 sm:gap-3">
                    <img
                      src={checkIcon}
                      alt=""
                      className="w-[20px] sm:w-[24px] flex-shrink-0"
                    />
                    <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[120%]">
                      Explicit + Implicit
                    </span>
                  </div>
                </div>

                <div
                  className="min-h-[120px] sm:min-h-[140px] md:min-h-[151px] relative overflow-hidden w-full p-4 sm:p-5 md:p-6 flex gap-2 sm:gap-3 md:gap-4 items-end justify-between"
                  style={{
                    background:
                      "linear-gradient(87.47deg, rgba(65, 65, 65, 0.24) 31.41%, rgba(32, 26, 30, 0.24) 87.36%, rgba(21, 11, 17, 0.24) 101.12%)",
                  }}
                >
                  <span className="max-w-[100px] sm:max-w-[120px] md:max-w-[131px] w-full uppercase font-medium text-[12px] sm:text-[13px] md:text-[14px] leading-[120%] text-white">
                    QUALITY OF ADVICE / CONSULT
                  </span>
                  <span
                    ref={secondCardRef}
                    className="text-white font-semibold text-[48px] sm:text-[56px] md:text-[64px] leading-[120%]"
                    role="text"
                    aria-live="polite"
                    aria-label={`${secondAnimatedValue}%`}
                  >
                    {secondAnimatedValue}%
                  </span>

                  <img
                    src={linesIcon}
                    className="absolute bottom-0 right-0 max-w-[80px] sm:max-w-[100px] md:max-w-full"
                    alt=""
                  />
                </div>
              </div>
              <AiConiqCard />

              <img
                src={ellipsisIconBottom}
                className="hidden lg:block absolute bottom-[-69%] right-[-31%]"
                alt=""
              />
            </div>

            <p className="max-w-[414px] w-full text-white font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] text-center px-4">
              {t("problemAndSolution.accuracyText")}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10 md:gap-[57px] items-center justify-center">
            <ChatButton
              label={t("problemAndSolution.chatButtonLabel")}
              onClick={openModal}
            />
            <span className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {t("problemAndSolution.howItWorks")}
            </span>
          </div>
        </div>

        <div className="hidden lg:block absolute top-0 right-[5%] max-w-[700px] w-[678px] h-[1400px]">
          <div
            style={{
              position: "absolute",
              width: "54px",
              height: "799px",
              left: "300px",
              top: "300px",
              background: "#FF21B2",
              opacity: 0.88,
              filter: "blur(150px)",
              borderRadius: "50%",
              transform: "rotate(-1deg)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProblemAndSolution;
