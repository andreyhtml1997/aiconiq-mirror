'use client';

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import KnowledgeCard from "./KnowledgeCard";
import ChatButton from "../../ui/ChatButton";

import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
const Knowledge = () => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const knowledgeSteps = [
    {
      icon: "/assets/knowledge-img/icon1.svg",
      title: t("knowledge.steps.0.title"),
      description: t("knowledge.steps.0.description"),
    },
    {
      icon: "/assets/knowledge-img/icon2.svg",
      title: t("knowledge.steps.1.title"),
      description: t("knowledge.steps.1.description"),
    },
    {
      icon: "/assets/knowledge-img/icon3.svg",
      title: t("knowledge.steps.2.title"),
      description: t("knowledge.steps.2.description"),
    },
    {
      icon: "/assets/knowledge-img/icon4.svg",
      title: t("knowledge.steps.3.title"),
      description: t("knowledge.steps.3.description"),
    },
  ];

  return (
    <section
      id="about"
      className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[110px]"
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
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-[58px] items-center justify-center">
        <SectionHeader
          badge={t("knowledge.badge")}
          title={t("knowledge.title")}
        />

        
        <video
          src="/assets/aiconiq-explainer_x264.mp4"
          className="w-full relative z-10"
          style={{ maxWidth: "100%", height: "auto" }}
          autoPlay
          muted
          playsInline
          controls
        />

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
          {knowledgeSteps.map((step, index) => (
            <KnowledgeCard
              key={index}
              icon={step.icon}
              index={index}
              title={step.title}
              description={step.description}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
        <ChatButton
          label={t("consultant.button")}
          onClick={() => setShowCalendly(true)}
        />
      </div>
    </section>
  );
};

export default Knowledge;
