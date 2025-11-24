'use client';

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import LeftBlock from "./LeftBlock";
import RightBlock from "./RightBlock";
import BottomBlock from "./BottomBlock";

const Positioning = () => {
  const t = useTranslations();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-[126px] w-full flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[50px] items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="min-h-[250px] relative mt-[-100px]">
        <img src="/assets/gradientline.svg" alt="" />
        <img src="/assets/blured-bg-pink.webp" alt="" className="absolute top-0 left-0" />
      </div>

      <div className="max-w-[1284px] w-full flex relative flex-col mt-[-200px] lg:flex-row items-start gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-4 max-w-full lg:max-w-[1114px] w-full order-2 lg:order-1">
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%] gradient-text">
            {t("positioning.title")
              .split("AICONIQ")
              .map((part, index, array) =>
                index < array.length - 1 ? (
                  <span key={index}>
                    {part}
                    <span className="font-bold">AICONIQ</span>
                  </span>
                ) : (
                  part
                )
              )}
          </h2>
          <p className="text-[#FFFFFF8F] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[160%] sm:leading-[170%] lg:leading-[180%]">
            {t("positioning.description")}
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeader badge={t("positioning.badge")} />
        </div>
      </div>

      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[104px] relative max-w-[1284px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-end lg:items-end gap-6 sm:gap-8">
          <LeftBlock icon="/assets/icons/user.svg" />
          <RightBlock />
        </div>
        <BottomBlock />
      </div>
    </section>
  );
};

export default Positioning;
