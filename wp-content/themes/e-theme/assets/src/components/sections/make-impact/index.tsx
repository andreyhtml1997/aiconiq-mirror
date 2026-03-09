'use client'

import { useTranslations } from 'next-intl'
import SectionHeader from '../../ui/SectionHeader'

const viewImg = '/assets/make-impact-img/view-img.webp'
const teamImg = '/assets/team-image.png'
const viewBehindImg = '/assets/make-impact-img/view-behind.webp'
const gradientline = '/assets/gradientline.svg'
const bluredBGPink = '/assets/blured-bg-pink.webp'

const MakeImpact = () => {
  const t = useTranslations();
  return (
    <section 
      id="team"
      className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-[114px] pb-3 sm:pb-4 md:pb-5">
      <div className="max-w-[1280px] w-full relative mx-auto flex flex-col gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center justify-center px-4 sm:px-6 md:px-8">
        <SectionHeader
          badge={t("makeImpact.badge")}
          title={t("makeImpact.title")}
        />

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

          {/* <div className="bg-[#D8008D] py-3 sm:py-4 md:py-5 border border-[#D8008D] px-6 sm:px-8 md:px-10 lg:px-12 flex absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full  overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
              style={{ transformOrigin: "left" }}
            />
            <span className="text-white font-medium text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[100%] whitespace-nowrap relative z-10">
              {t("makeImpact.comingSoon")}
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MakeImpact;
