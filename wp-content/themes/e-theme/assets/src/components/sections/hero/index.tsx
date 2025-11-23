import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo.svg";
import Navigation from "./navigation";
import HeroHeadline from "./HeroHeadline";

import heroVideo from "../../../assets/hero/f570a274.mp4";
import ChatButton from "../../ui/ChatButton";
// import MediaControls from "../../ui/MediaControls";

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  //@ts-ignore
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // const handlePlayPause = (playing: boolean) => {
  //   if (videoRef.current) {
  //     if (playing) {
  //       videoRef.current.play();
  //     } else {
  //       videoRef.current.pause();
  //     }
  //     setIsPlaying(playing);
  //   }
  // };

  // const handleVolumeToggle = (muted: boolean) => {
  //   if (videoRef.current) {
  //     videoRef.current.muted = muted;
  //     setIsMuted(muted);
  //   }
  // };

  return (
    <section
      id="home"
      className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex"
      style={{ minHeight: "clamp(500px, 80vh, 917px)" }}
    >
      <div className="bg-color-black p-[1px] rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] flex w-full">
        <div className="w-full rounded-[20px] xs:rounded-t-[30px] sm:rounded-b-none sm:rounded-t-[35px] bg-black md:rounded-t-[40px] lg:rounded-t-[47px] !flex flex-col justify-between relative overflow-hidden">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full  object-cover rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]"
            loop
            muted={isMuted}
            autoPlay="True"
            playsInline
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 rounded-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px] pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(102.08% 102.07% at 50.73% 0%, rgba(0, 0, 0, 0) 41.02%, #000000 95.66%), radial-gradient(80.27% 340.83% at 78.8% 44.85%, rgba(0, 0, 0, 0) 47.54%, #000000 100%), linear-gradient(174.81deg, rgba(0, 0, 0, 0.4) 6.08%, rgba(0, 0, 0, 0) 35.58%)`,
            }}
          />

          <div className="flex flex-row p-3 xs:p-4 sm:p-5 md:p-6 lg:p-[28px] items-start sm:items-center w-full justify-between relative z-10 gap-3 xs:gap-4 sm:gap-0">
            <img
              src={logo}
              className="w-full"
              style={{ maxWidth: "clamp(120px, 20vw, 193px)" }}
              alt=""
            />
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>

          <div
            className="flex flex-col relative z-10 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12"
            style={{ gap: "clamp(2rem, 8vw, 83px)" }}
          >
            <div className="flex flex-col xl:flex-row items-start lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full">
                <h1
                  style={{
                    background:
                      "linear-gradient(184.14deg, #FFFFFF 61.8%, #F4DCEC 96.62%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    fontSize: "clamp(28px, 5vw, 64px)",
                  }}
                  className="leading-[120%] font-medium"
                >
                  {t("hero.mainHeading")}
                </h1>
                <HeroHeadline />
              </div>

              <p
                className="max-w-full lg:max-w-[416px] w-full text-left lg:text-right text-[#FFFFFF8F] leading-[160%]"
                style={{ fontSize: "clamp(13px, 1.2vw, 16px)" }}
              >
                {t("hero.description")}
              </p>
            </div>
            <div className="flex flex-col gap-[30px]">
              <div className="w-full overflow-hidden">
                <LineHr />
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 xs:gap-6 sm:gap-7 lg:gap-8">
                <div className="flex gap-2 xs:gap-3 sm:gap-4 ">
                  <ChatButton onClick={() => console.log("Chat clicked")} />
                  {/* <MediaControls
                    onPlayPause={handlePlayPause}
                    onVolumeToggle={handleVolumeToggle}
                  /> */}
                </div>
                <div
                  className="w-full lg:max-w-[806px] flex flex-wrap justify-start lg:justify-end"
                  style={{ gap: "clamp(1.5rem, 5vw, 61px)" }}
                >
                  <div className="flex flex-col">
                    <span
                      className="text-[#FFFFFFD9] font-medium leading-[120%]"
                      style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
                    >
                      {t("hero.stats.timeToMarket.value")}
                    </span>
                    <p
                      className="text-[#FFFFFF8F] leading-[160%]"
                      style={{ fontSize: "clamp(11px, 1vw, 14px)" }}
                    >
                      {t("hero.stats.timeToMarket.label")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[#FFFFFFD9] font-medium leading-[120%]"
                      style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
                    >
                      {t("hero.stats.implementation.value")}
                    </span>
                    <p
                      className="text-[#FFFFFF8F] leading-[160%]"
                      style={{ fontSize: "clamp(11px, 1vw, 14px)" }}
                    >
                      {t("hero.stats.implementation.label")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[#FFFFFFD9] font-medium leading-[120%]"
                      style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
                    >
                      {t("hero.stats.projectCosts.value")}
                    </span>
                    <p
                      className="text-[#FFFFFF8F] leading-[160%]"
                      style={{ fontSize: "clamp(11px, 1vw, 14px)" }}
                    >
                      {t("hero.stats.projectCosts.label")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

const LineHr = () => {
  return (
    <svg
      width="100%"
      height="1"
      viewBox="0 0 1776 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="w-full"
    >
      <path
        d="M0 0.500122L1776 0.499967"
        stroke="url(#paint0_linear_6622_9399)"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6622_9399"
          x1="0"
          y1="0.500122"
          x2="1405"
          y2="0.500122"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#26272C" />
          <stop offset="1" stopColor="white" stopOpacity="0.16" />
        </linearGradient>
      </defs>
    </svg>
  );
};
