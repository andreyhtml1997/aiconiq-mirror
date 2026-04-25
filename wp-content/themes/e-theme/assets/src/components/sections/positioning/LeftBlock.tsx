'use client';

import { useTranslations } from "next-intl";
import BadgeIcon from "../../ui/BadgeIcon";
import type { PositioningIntroData } from "@/types/blocks";

const lines = '/assets/lines.svg'

interface LeftBlockProps {
  icon: string;
  data?: PositioningIntroData['left_block']
}

const LeftBlock = ({ icon, data }: LeftBlockProps) => {
  const t = useTranslations();

  const badge = data?.badge || t("positioning.leftBlock.badge");
  const title = data?.title || t("positioning.leftBlock.title");
  const description = data?.description || t("positioning.leftBlock.description");
  const iconSrc = data?.icon?.url || icon;

  return (
    <div className="flex relative lg:absolute lg:top-[-31px] lg:left-[0] flex-col z-[20] bg-[#141112] max-w-full lg:max-w-[618px] rounded-[12px] min-h-[350px] sm:min-h-[400px] lg:h-[458px] justify-between w-full p-4 sm:p-5 md:p-6 lg:p-8">
      <BadgeIcon icon={iconSrc} />
      <img
        src={lines}
        alt=""
        className="absolute top-0 right-0 w-auto max-w-[50%] opacity-25 sm:max-w-[60%] lg:max-w-full"
      />

      <div className="flex flex-col gap-3 sm:gap-4 items-start">
        {badge && (
          <div className="py-1 !flex px-3 sm:px-4 rounded-full gradient-border-mask22 mb-3 sm:mb-4 bg-[#EB3CAE52]">
            <span className="gradient-text text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[160%]">
              {badge}
            </span>
          </div>
        )}
        <h3 className="text-[#FFFFFF] font-semibold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[110%] sm:leading-[100%]">
          {title}
        </h3>
        <p className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LeftBlock;
