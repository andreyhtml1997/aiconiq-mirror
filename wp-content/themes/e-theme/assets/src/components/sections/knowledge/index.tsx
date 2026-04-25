'use client';

import { useTranslations } from "next-intl";
import KnowledgeCard from "./KnowledgeCard";
import { useState } from "react";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import ChatButton from "../../ui/ChatButton";
import type { KnowledgeStepsData, KnowledgeAnimationType } from "@/types/blocks";

const FALLBACK_ICONS = [
  '/assets/knowledge-img/icon1.svg',
  '/assets/knowledge-img/icon2.svg',
  '/assets/knowledge-img/icon3.svg',
  '/assets/knowledge-img/icon4.svg',
];
const FALLBACK_ANIMATIONS: KnowledgeAnimationType[] = ['card1', 'card2', 'card3', 'card4'];

interface Props {
  data?: KnowledgeStepsData
}

const Knowledge = ({ data }: Props = {}) => {
  const t = useTranslations();
  const [showCalendly, setShowCalendly] = useState(false);

  const knowledgeSteps = data?.steps?.length
    ? data.steps.map((s, i) => ({
        icon: s.icon?.url || FALLBACK_ICONS[i] || FALLBACK_ICONS[0],
        title: s.title,
        description: s.description,
        animationType: s.animation_type || FALLBACK_ANIMATIONS[i] || 'card1',
        videoPath: s.video?.url,
      }))
    : [0, 1, 2, 3].map((i) => ({
        icon: FALLBACK_ICONS[i],
        title: t(`knowledge.steps.${i}.title`),
        description: t(`knowledge.steps.${i}.description`),
        animationType: FALLBACK_ANIMATIONS[i],
        videoPath: undefined as string | undefined,
      }));

  const button = data?.button;
  const buttonHref = button?.mode === 'url' ? button.url?.url : undefined;
  const buttonTarget = button?.mode === 'url' ? (button.url?.target || '_self') : '_self';
  const handleButtonClick = () => {
    if (!button || button.mode === 'url') return;
    setShowCalendly(true);
  };

  return (
    <section
      id="knowledge-steps"
      className="py-8 sm:py-10 md:py-12"
    >
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
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {knowledgeSteps.map((step, index) => (
          <KnowledgeCard
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
            animationType={step.animationType}
            videoPath={step.videoPath}
            reverse={index % 2 !== 0}
          />
        ))}

        {button?.label && (
          buttonHref ? (
            <a
              href={buttonHref}
              target={buttonTarget}
              rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
              className="mt-4 self-center"
            >
              <ChatButton label={button.label} />
            </a>
          ) : (
            <div className="mt-4 self-center">
              <ChatButton label={button.label} onClick={handleButtonClick} />
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Knowledge;
