"use client";

import type { AutoVsIntroVideoData } from "@/types/blocks";

const FALLBACK_VIDEO = "/assets/INVENTIVE_AICONIQ_Hero-Video_20260127_16x9_1080p_FINAL_x264.mp4";

interface Props { data?: AutoVsIntroVideoData }

const AutoVsIntroVideo = ({ data }: Props = {}) => {
  const videoUrl = data?.video?.url || FALLBACK_VIDEO;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8">
      <div
        className="flex items-center justify-center flex-col relative w-full"
        style={{ minHeight: "clamp(120px, 20vw, 250px)" }}
      >
        <video
          src={videoUrl}
          className="w-full relative z-10"
          style={{ maxWidth: "100%", height: "auto" }}
          autoPlay
          muted
          playsInline
          controls
        />
        <HrLine />
      </div>
    </section>
  );
};

export default AutoVsIntroVideo;

const HrLine = () => (
  <svg className="absolute bottom-0" width="1776" height="1" viewBox="0 0 1776 1" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.64" d="M0 0.500122L1776 0.499967" stroke="url(#paint0_linear_avs_iv)" />
    <defs>
      <linearGradient id="paint0_linear_avs_iv" x1="353.5" y1="0.500122" x2="1405" y2="0.500122" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.16" />
        <stop offset="0.519231" stopColor="#FF21B2" />
        <stop offset="1" stopColor="white" stopOpacity="0.16" />
      </linearGradient>
    </defs>
  </svg>
);
