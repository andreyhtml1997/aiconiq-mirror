'use client';

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import type { KnowledgeIntroData } from "@/types/blocks";

const FALLBACK_VIDEO = '/assets/main_video_new.mp4'

interface Props { data?: KnowledgeIntroData }

const KnowledgeIntro = ({ data }: Props = {}) => {
  const t = useTranslations();

  const badge = data?.badge || t("knowledge.badge");
  const title = data?.title || t("knowledge.title");
  const videoSrc = data?.video?.url || FALLBACK_VIDEO;

  return (
    <section
      id="about"
      className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[110px]"
    >
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-10 sm:gap-12 md:gap-14 lg:gap-[58px] items-center justify-center">
        <SectionHeader badge={badge} title={title} />
        <video
          src={videoSrc}
          className="w-full relative z-10"
          style={{ maxWidth: "100%", height: "auto" }}
          autoPlay
          muted
          playsInline
          controls
        />
      </div>
    </section>
  );
};

export default KnowledgeIntro;
