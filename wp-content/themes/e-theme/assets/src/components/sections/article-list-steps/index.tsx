'use client'
import { useState } from "react";
import { PinIcon } from "../../ui/ChatButton";
import SectionBadge from "../../ui/SectionBadge";

const lines = '/assets/lines-article.webp'

interface Step {
  id: number;
  title: string;
  content: string[];
}

interface ArticleListStepsProps {
  tabs?: { title?: string; text?: string }[];
}

const ArticleListSteps = ({ tabs }: ArticleListStepsProps) => {
  // строим шаги только из ACF Tabs
  const steps: Step[] =
    tabs && tabs.length
      ? tabs.map((tab, index) => ({
          id: index + 1,
          title: tab.title || "",
          content: tab.text ? [tab.text] : [],
        }))
      : [];

  const [activeStep, setActiveStep] = useState<number>(steps[0]?.id || 1);

  // если нет шагов — вообще не рендерим секцию
  if (!steps.length) {
    return null;
  }

  const currentStep: Step =
    steps.find((step) => step.id === activeStep) || steps[0];

  return (
    <section className="max-w-[1280px] w-full mx-auto py-12 sm:py-16 md:py-20 relative lg:py-[112px] px-4 sm:px-6 md:px-8">
      <img
        src={lines}
        className="absolute bottom-0 -left-1/2 w-full max-w-[550px] -translate-y-1/2"
        alt=""
      />
      <img
        src={lines}
        className="absolute top-0 -right-1/3 w-full max-w-[450px] -translate-y-1/2"
        alt=""
      />

      <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-[63px]">
        {/* Left Sidebar - Sticky */}
        <div className="w-full lg:max-w-[350px] lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-6 sm:gap-8 items-start">
            {/* Badge */}
            <div className="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[14px] sm:text-[16px] leading-[160%]">
                {/* если понадобится, сюда можно подставить что-то из ACF */}
                Inhaltsverzeichnis
              </span>
            </div>

            {/* Steps List */}
            <div className="flex flex-col gap-3 sm:gap-[13px] w-full">
              {steps.map((step: Step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex gap-2 sm:gap-2.5 items-center text-left transition-all duration-300 ${
                    activeStep === step.id
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <PinIcon />
                  </div>
                  {step.title && (
                    <span
                      className={`leading-[160%] transition-all duration-300 ${
                        activeStep === step.id
                          ? "text-white font-medium text-[18px] sm:text-[20px]"
                          : "text-[#FFFFFF8F] font-normal text-[14px] sm:text-[16px]"
                      }`}
                      style={
                        activeStep === step.id
                          ? { lineHeight: "180%" }
                          : { lineHeight: "160%" }
                      }
                    >
                      {step.title}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Divider - Hidden on mobile */}
        <div className="hidden lg:block w-px bg-[#FFFFFF]/10 self-stretch" />

        {/* Right Content Area */}
        <div className="flex-1 max-w-full lg:max-w-[853px]">
          <div className="flex flex-col gap-6 sm:gap-8 items-start">
            <SectionBadge badge="Inhalte" middleWord="" />

            {/* Заголовок можно брать из первого шага, если есть */}
            {currentStep.title && (
              <h3 className="text-white text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px] leading-[110%] font-semibold">
                {currentStep.title}
              </h3>
            )}

            {/* Dynamic Content */}
            <div className="flex flex-col gap-8 sm:gap-10">
              {currentStep.content.map((paragraph, index) => {
                if (!paragraph) return null;

                return (
                  <div
                    key={index}
                    className="wysiwyg-step font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[170%] sm:leading-[180%] text-[#FFFFFF8F]"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleListSteps;
