'use client'

import { useTranslations } from 'next-intl'
import SectionHeader from '../../ui/SectionHeader'
import type { MakeImpactData } from "@/types/blocks";

const FALLBACK_TEAM = '/assets/team-image.png'
const viewBehindImg = '/assets/make-impact-img/view-behind.webp'
const gradientline = '/assets/gradientline.svg'
const bluredBGPink = '/assets/blured-bg-pink.webp'

interface Props {
  data?: MakeImpactData
}

const MakeImpact = ({ data }: Props = {}) => {
  const t = useTranslations();

  const badge = data?.badge || t("makeImpact.badge");
  const title = data?.title || t("makeImpact.title");
  const teamImg = data?.team_image?.url || FALLBACK_TEAM;

  return (
    <section
      id="team"
      className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[114px] pb-3 sm:pb-4 md:pb-5">
      <div className="max-w-[1280px] w-full relative mx-auto flex flex-col gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center justify-center px-4 sm:px-6 md:px-8">
        <SectionHeader badge={badge} title={title} />
        <img
          src={bluredBGPink}
          alt=""
          className="absolute top-[-21%] left-0 scale-y-[-1] z-0 h-[500px] w-full"
        />
        <div className="max-w-[1280px] w-full relative ">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={gradientline}
              alt=""
              className="relative left-[20px] bottom-[-30px]"
            />
          </div>
          <img src={teamImg} alt="" style={{ maxWidth: '800px', margin: '0 auto' }} className="relative z-10 w-full h-auto " />
          <img
            src={viewBehindImg}
            alt=""
            className="hidden lg:block absolute left-[-120px] top-[60%] transform -translate-y-1/2 max-w-[300px] xl:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default MakeImpact;
