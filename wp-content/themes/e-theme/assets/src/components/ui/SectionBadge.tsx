'use client';

import { motion } from "framer-motion";
import { useState } from "react";

interface SectionBadgeProps {
  badge: string;
  middleWord?: string;
}

const SectionBadge = ({ badge, middleWord }: SectionBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Split badge into two words if middleWord is provided
  const words = middleWord ? badge.split(" ") : [badge];
  const firstWord = words[0] || "";
  const lastWord = words.length > 1 ? words.slice(1).join(" ") : "";

  return (
    <div
      className="p-[1px] hover:bg-[#FF21B214] max-w-fit flex cursor-pointer items-center justify-center w-full rounded-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-6 z-10 py-2 overflow-hidden gradient-border-mask-badge relative w-full text-center rounded-full !flex items-center justify-center gap-1">
        <img
          src="/assets/button-ellipses/left-gradient.svg"
          alt=""
          className="absolute left-[-1px] h-full w-auto"
        />

        {middleWord ? (
          <>
            <span className="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10">
              {firstWord}
            </span>
            <span
              className="uppercase font-medium relative z-10"
              style={{
                fontSize: "8px",
                lineHeight: "20px",
                letterSpacing: "0.08em",
                color: "#FFFFFF7A",
              }}
            >
              {middleWord}
            </span>
            <span className="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10">
              {lastWord}
            </span>
          </>
        ) : (
          <span className="uppercase text-[#FFFFFF] font-medium text-[12px] leading-[20px] relative z-10">
            {badge}
          </span>
        )}
        <motion.img
          src="/assets/button-ellipses/top-bluir.svg"
          alt=""
          className="absolute top-0 left-0 h-auto"
          initial={{ opacity: 0, width: "0%" }}
          animate={{
            opacity: isHovered ? 1 : 0,
            width: isHovered ? "50%" : "0%",
          }}
          transition={{
            type: "spring",
            stiffness: 20,
            damping: 10,
            mass: 1,
          }}
        />
      </div>

      <motion.div
        className="absolute bottom-0 right-0 w-[58px] h-[16px] rounded-[13px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{
          type: "spring",
          stiffness: 20,
          damping: 10,
          mass: 1,
        }}
        style={{
          background: "rgba(255, 33, 178, 0.4)",
          filter: "blur(12px)",
        }}
      />

      <motion.div
        className="absolute top-[0] left-0 h-[5px]"
        initial={{ opacity: 0, x: 20, scale: 0.4 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 20,
          scale: isHovered ? 1 : 0.7,
        }}
        transition={{
          type: "spring",
          stiffness: 20,
          damping: 10,
          mass: 1,
        }}
      >
        <motion.div
          className="w-[94px] h-[26px] rounded-[13px]"
          animate={{
            scaleX: isHovered ? 0.8 : 0.4,
            scaleY: isHovered ? 0.8 : 0.4,
          }}
          transition={{
            type: "spring",
            stiffness: 20,
            damping: 10,
            mass: 1,
          }}
          style={{
            background: "rgba(255, 33, 178, 0.4)",
            filter: "blur(5px)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default SectionBadge;
