"use client";

import { useTranslations } from "next-intl";
import SectionHeader from "../../ui/SectionHeader";
import ChatButton from "../../ui/ChatButton";

const AutoVSteamWork = () => {
  const t = useTranslations();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[100px] px-4 sm:px-6 md:px-8">
      <div
        className="flex items-center justify-center flex-col relative w-full"
        style={{ minHeight: "clamp(120px, 20vw, 250px)" }}
      >
        <img
          src="/assets/hero/hero-lines.svg"
          alt=""
          className="absolute top-1/2 w-full left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ maxWidth: "clamp(250px, 40vw, 450px)" }}
        />
        <img
          src="/assets/hero/hero-ellipse.webp"
          alt=""
          className="w-full relative z-10"
          style={{ maxWidth: "clamp(150px, 25vw, 250px)" }}
        />
        <HrLine />
      </div>
      <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center text-center max-w-[1200px] mx-auto">
        <SectionHeader
          badge={t("autoVSteamWork.badge")}
          middleWord={t("autoVSteamWork.middleWord")}
        />
        <h2
          className={`gradient-text font-medium text-[48px] leading-[120%] text-center w-full mx-auto`}
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
          }}
        >
          <span className="font-bold">
            {t("autoVSteamWork.title", { nsSeparator: "#" }).split(" ")[0]}
          </span>{" "}
          <span>
            {t("autoVSteamWork.title", { nsSeparator: "#" })
              .split(" ")
              .slice(1)
              .join(" ")}
          </span>
        </h2>
        <p className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[180%] max-w-[1063px]">
          {t("autoVSteamWork.description")}
        </p>
      </div>

      <div className="w-full max-w-[1280px] mx-auto justify-center flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12">
        <div className="bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
          <div className="p-2 flex flex-col gap-6 sm:gap-8 h-full items-start">
            <div className="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[16px] leading-[160%]">
                {t("autoVSteamWork.automation.badge")}
              </span>
            </div>
            <h2 className="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]">
              {t("autoVSteamWork.automation.heading")}
            </h2>
            <p className="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {t("autoVSteamWork.automation.description")}
            </p>
            <div className="w-full border-t border-[#281A23]"></div>
            <div className="p-2 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">
                {t("autoVSteamWork.automation.useCases.title")}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.automation.useCases.reporting")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.automation.useCases.dataMaintenance")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.automation.useCases.meetingProtocols")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.automation.useCases.scheduling")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col w-full">
              <div
                className="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                style={{
                  background:
                    "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
                }}
              >
                <span className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">
                  {t("autoVSteamWork.automation.example.title")}
                </span>
              </div>
              <div className="py-6 sm:py-8 px-3 sm:px-4">
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">
                  {t("autoVSteamWork.automation.example.paragraph1")}{" "}
                </p>
                <br />
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">
                  {t("autoVSteamWork.automation.example.paragraph2")}
                </p>
              </div>

              <div
                className="rounded-[4px] relative overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                style={{
                  border: "0.5px solid transparent",
                  background:
                    "linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179, 77, 143, 0) 0%, rgba(179, 77, 143, 0.16) 100%) border-box",
                }}
              >
                <img
                  src="/assets/lines.svg"
                  className="absolute top-0 right-0 hidden sm:block"
                  alt=""
                />
                <div className="flex flex-col gap-3 sm:gap-4">
                  <img
                    src="/assets/auto/icon1.webp"
                    alt=""
                    className="max-w-[60px] sm:max-w-[75px] w-full"
                  />
                  <span className="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]">
                    {t("autoVSteamWork.automation.example.resultLabel")}
                  </span>
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0">
                  <span className="text-[#FFFFFF] flex font-semibold text-[60px] sm:text-[80px] md:text-[100.24px] leading-[120%]">
                    {t("autoVSteamWork.automation.example.resultValue")}{" "}
                    <span className="text-gradient">%</span>
                  </span>
                  <div className="sm:p-3">
                    <p className="text-[#FFFFFF8F] font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[160%]">
                      {t("autoVSteamWork.automation.example.resultDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#141112] max-w-full lg:max-w-[545px] w-full items-start rounded-[16px] border border-[#FF21B214] p-2 flex flex-col gap-4">
          <div className="p-2 flex flex-col gap-6 sm:gap-8 items-start h-full">
            <div className="py-1 !flex px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]">
              <span className="gradient-text text-[16px] leading-[160%]">
                {t("autoVSteamWork.collaboration.badge")}
              </span>
            </div>
            <h2 className="text-white font-semibold text-[22px] sm:text-[24px] md:text-[28px] leading-[120%]">
              {t("autoVSteamWork.collaboration.heading")}{" "}
            </h2>
            <p className="text-[#FFFFFF8F] text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
              {t("autoVSteamWork.collaboration.description")}
            </p>
            <div className="w-full border-t border-[#281A23]"></div>
            <div className="p-2 flex flex-col gap-3 sm:gap-4">
              <h3 className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">
                {t("autoVSteamWork.collaboration.useCases.title")}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.collaboration.useCases.strategy")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.collaboration.useCases.decisionSupport")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.collaboration.useCases.innovation")}
                  </span>
                </div>
                <div className="pl-2 flex gap-3 items-start">
                  <img
                    src="/assets/problem/check.svg"
                    alt=""
                    className="w-[20px] sm:w-[24px] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[#FFFFFFA3] text-[13px] sm:text-[14px] leading-[140%] sm:leading-[120%] flex-1">
                    {t("autoVSteamWork.collaboration.useCases.marketing")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FF21B20A] mt-auto rounded-[8px] border border-[#FF21B20A] p-2 flex flex-col">
              <div
                className="rounded-[4px] py-2 sm:py-3 flex items-center justify-center w-full gap-4"
                style={{
                  background:
                    "linear-gradient(89.58deg, rgba(118, 22, 85, 0.06) 32.55%, rgba(230, 54, 169, 0.06) 86.39%, rgba(254, 109, 203, 0.06) 99.63%)",
                }}
              >
                <span className="text-white font-medium text-[16px] sm:text-[18px] leading-[120%]">
                  {t("autoVSteamWork.collaboration.example.title")}
                </span>
              </div>
              <div className="py-6 sm:py-8 px-3 sm:px-4">
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]">
                  {t("autoVSteamWork.collaboration.example.paragraph")}
                </p>
                <br />
                <p className="text-[#FFFFFF8F] text-[13px] sm:text-[14px] leading-[160%]"></p>
              </div>

              <div
                className="rounded-[4px] relative items-start overflow-hidden p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                style={{
                  border: "0.5px solid transparent",
                  background:
                    "linear-gradient(#FF21B20A, #FF21B20A) padding-box, linear-gradient(90deg, rgba(179, 77, 143, 0) 0%, rgba(179, 77, 143, 0.16) 100%) border-box",
                }}
              >
                <img
                  src="/assets/lines.svg"
                  className="absolute top-0 right-0 hidden sm:block"
                  alt=""
                />
                <div className="flex flex-col gap-2 sm:gap-3">
                  <span className="text-[#FFFFFF] font-medium text-[13px] sm:text-[14px] leading-[120%]">
                    {t("autoVSteamWork.collaboration.example.conclusionTitle")}
                  </span>
                </div>
                <p className="text-[#FFFFFF8F] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[160%]">
                  {t("autoVSteamWork.collaboration.example.conclusionText")}
                </p>
                <ChatButton onClick={() => console.log("Chat clicked")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoVSteamWork;

const HrLine = () => {
  return (
    <svg
      className="absolute bottom-0"
      width="1776"
      height="1"
      viewBox="0 0 1776 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.64"
        d="M0 0.500122L1776 0.499967"
        stroke="url(#paint0_linear_6622_9976)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6622_9976"
          x1="353.5"
          y1="0.500122"
          x2="1405"
          y2="0.500122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.16" />
          <stop offset="0.519231" stopColor="#FF21B2" />
          <stop offset="1" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
      </defs>
    </svg>
  );
};
