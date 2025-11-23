import { motion } from "framer-motion";
import Path1, { Path2, Path3 } from "../../../ui/paths";

import hightlight from "../../../../assets/knowledge-img/charts/hightlight.webp";
import hightlight2 from "../../../../assets/knowledge-img/charts/hightlight2.webp";

const Card2 = () => {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        width: "547px",
        height: "391px",
        backgroundColor: "#271B22",
      }}
      initial="initial"
      whileHover="hover"
    >
      <img src={hightlight} alt="" className="absolute top-0 left-0" />
      <img src={hightlight2} alt="" className="absolute top-0 right-0" />
      <EmptyCard
        className="absolute top-[-35px] right-0 z-10  "
        initial={{ y: -100, opacity: 0 }}
        hover={{ y: 0, opacity: 1 }}
      />
      <EmptyCard
        className="absolute bottom-[-35px] right-5 z-10"
        initial={{ y: 100, opacity: 0 }}
        hover={{ y: 0, opacity: 1 }}
      />
      <EmptyCard
        className="absolute top-1/2 -translate-y-1/2 left-[-15%] z-10"
        initial={{ x: -100, opacity: 0 }}
        hover={{ x: 0, opacity: 1 }}
      />
      <EmptyCard
        className="absolute bottom-[20%] -translate-y-1/ right-[-15%] z-10"
        initial={{ x: 100, opacity: 0 }}
        hover={{ x: 0, opacity: 1 }}
      />

      <Animate1 />
    </motion.div>
  );
};

export default Card2;

const Animate1 = () => {
  return (
    <motion.svg
      width="525"
      height="391"
      viewBox="0 0 525 391"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="initial"
      whileHover="hover"
      className="z-10  relative"
    >
      <g>
        <rect
          x="95.8706"
          y="26"
          width="210.658"
          height="58.6336"
          rx="7.68966"
          fill="#1D1419"
        />
        <motion.rect
          x="96.1109"
          y="26.2403"
          width="210.177"
          height="58.153"
          rx="7.44935"
          stroke="#FF21B2"
          strokeOpacity="0.08"
          strokeWidth="0.480603"
          variants={{
            initial: { strokeOpacity: 0.08 },
            hover: { strokeOpacity: 1 },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.rect
          x="107.405"
          y="37.5347"
          width="35.5647"
          height="35.5647"
          rx="3.41679"
          variants={{
            initial: { fill: "#FFFFFF14" },
            hover: { fill: "#FF21B214" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.path
          d="M133.399 63.5286L129.43 59.5597M131.574 54.4046C131.574 58.4359 128.306 61.7038 124.275 61.7038C120.244 61.7038 116.976 58.4359 116.976 54.4046C116.976 50.3734 120.244 47.1055 124.275 47.1055C128.306 47.1055 131.574 50.3734 131.574 54.4046Z"
          variants={{
            initial: { stroke: "#FFFFFF14" },
            hover: { stroke: "#D8008D" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          stroke-width="0.961207"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M158.349 37.5347L158.349 73.0993"
          stroke=""
          stroke-width="0.961207"
        />
        <Path1 />
        <rect
          x="232.362"
          y="163"
          width="218.194"
          height="58.6336"
          rx="7.68966"
          fill="#1D1419"
        />
        <motion.rect
          x="232.602"
          y="163.24"
          width="217.713"
          height="58.153"
          rx="7.44935"
          stroke="#FF21B2"
          strokeOpacity="0.08"
          strokeWidth="0.480603"
          variants={{
            initial: { strokeOpacity: 0.08 },
            hover: { strokeOpacity: 1 },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.rect
          x="243.896"
          y="174.535"
          width="35.5647"
          height="35.5647"
          rx="3.41679"
          variants={{
            initial: { fill: "#FFFFFF14" },
            hover: { fill: "#FF21B214" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.path
          d="M270.803 192.317H267.153L264.416 200.529L258.941 184.105L256.204 192.317H252.555"
          variants={{
            initial: { stroke: "#FFFFFF14" },
            hover: { stroke: "#D8008D" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          stroke-width="0.961207"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M294.84 174.535L294.84 210.099"
          stroke="#2B1F27"
          stroke-width="0.961207"
        />
        <Path2 />
        <rect
          x="95.8706"
          y="286"
          width="218.194"
          height="58.6336"
          rx="7.68966"
          fill="#1D1419"
        />
        <motion.rect
          x="96.1109"
          y="286.24"
          width="217.713"
          height="58.153"
          rx="7.44935"
          stroke="#FF21B2"
          strokeOpacity="0.08"
          strokeWidth="0.480603"
          variants={{
            initial: { strokeOpacity: 0.08 },
            hover: { strokeOpacity: 1 },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.rect
          x="107.405"
          y="297.534"
          width="35.5647"
          height="35.5647"
          rx="3.41679"
          variants={{
            initial: { fill: "#FFFFFF14" },
            hover: { fill: "#FF21B214" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.path
          d="M122.45 314.404L125.188 317.141L134.312 308.017M133.399 315.317V321.703C133.399 322.187 133.207 322.651 132.865 322.994C132.523 323.336 132.058 323.528 131.574 323.528H118.801C118.317 323.528 117.853 323.336 117.511 322.994C117.168 322.651 116.976 322.187 116.976 321.703V308.93C116.976 308.446 117.168 307.982 117.511 307.639C117.853 307.297 118.317 307.105 118.801 307.105H128.837"
          variants={{
            initial: { stroke: "#FFFFFF14" },
            hover: { stroke: "#D8008D" },
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          stroke-width="0.961207"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M158.349 297.534L158.349 333.099"
          stroke="#2B1F27"
          stroke-width="0.961207"
        />
        <Path3 />
      </g>
      <defs>
        <filter
          id="filter0_f_6436_7544"
          x="-63.2"
          y="-31.2"
          width="594.969"
          height="460.4"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.6"
            result="effect1_foregroundBlur_6436_7544"
          />
        </filter>
      </defs>
    </motion.svg>
  );
};

interface EmptyCardProps {
  className?: string;
  initial?: { x?: number; y?: number; opacity?: number };
  hover?: { x?: number; y?: number; opacity?: number };
}

const EmptyCard = ({ className, initial, hover }: EmptyCardProps) => {
  return (
    <motion.div
      className={`bg-[#161014] blur-[3px] border w-[218px] border-[#FF21B214] flex flex-col gap-2 items-start p-3 rounded-lg opacity-[0.84] ${className}`}
      style={{
        borderWidth: "0.481px",
      }}
      variants={{
        initial: initial || {},
        hover: hover || {},
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex gap-4 items-center w-full">
        {/* Icon placeholder */}
        <div
          className="bg-[#FF21B214] rounded-sm flex-shrink-0"
          style={{
            width: "35.565px",
            height: "35.565px",
            padding: "6.834px",
          }}
        />

        {/* Vertical divider line */}
        <div
          className="bg-[#2B1F27] flex-shrink-0"
          style={{
            width: "0.961px",
            height: "35.565px",
          }}
        />

        {/* Trigger section */}
        <div className="flex flex-col justify-between h-[35.565px] flex-1">
          <p
            className="text-white font-medium opacity-[0.56] whitespace-nowrap"
            style={{
              fontSize: "9.612px",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Trigger
          </p>
          <div
            className="bg-[#2B1F27] rounded-sm"
            style={{
              height: "13.457px",
              width: "100%",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
