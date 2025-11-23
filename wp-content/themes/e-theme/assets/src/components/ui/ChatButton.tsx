import { useTranslation } from "react-i18next";

interface ChatButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

const ChatButton = ({ onClick, className = "", label }: ChatButtonProps) => {
  const { t } = useTranslation();
  const buttonLabel = label || t("chatButton.label");

  return (
    <button
      onClick={onClick}
      className={`
        bg-[rgba(247,247,249,0.06)] border border-[rgba(255,255,255,0.04)]
        rounded-[30px] p-[10px]
        overflow-hidden
        flex items-center
        transition-all duration-200
        min-w-fit
        group
        ${className}
      `}
      aria-label={buttonLabel}
    >
      <div className="relative w-full bg-[]">
        {/* outer shadow */}
        <div
          className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(ellipse 100% 100% at center, rgba(255, 33, 178, 0.5) 0%, rgba(255, 33, 178, 0.3) 30%, rgba(255, 33, 178, 0.15) 50%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div className="bg-gradient-to-b border-[0.5px] border-[#000000] w-full overflow-hidden from-[#28292e] to-[#201f1b] rounded-[70px] px-8 py-[12px] relative transition-all duration-300">
          {/* Gradient border on hover */}
          <div
            className="absolute inset-0 rounded-[70px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              padding: "0.5px",
              background:
                "linear-gradient(270deg, rgba(255, 33, 178, 0.24) 0%, rgba(0, 0, 0, 0.24) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* inner shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div
            className="absolute right-0 overflow-hidden top-1/2 -translate-y-1/2 w-[150px] h-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(92deg, #28292E -1.41%, #201F1B 39.02%, #620040 77.9%)",
              // boxShadow: "0px 0px 20px 3px #FF21B2",
              filter: "blur(6px)",
            }}
          />

          <div className="flex items-center justify-center gap-[11px] relative z-10">
            <span className="text-[#f5f1ee] text-[14px] font-medium whitespace-nowrap leading-[1.2]">
              {buttonLabel}
            </span>
            <PinIcon />
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatButton;

export const PinIcon = () => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="4"
        cy="4"
        r="3.5"
        fill="url(#paint0_linear_249_8913)"
        stroke="url(#paint1_linear_249_8913)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_249_8913"
          x1="4"
          y1="0"
          x2="4"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#CC5DB8" />
          <stop offset="1" stop-color="#C250B7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_249_8913"
          x1="4"
          y1="0"
          x2="4"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F1EBE0" />
          <stop offset="0.324089" stop-color="#C547AE" />
          <stop offset="0.772485" stop-color="#AB318D" />
          <stop offset="1" stop-color="#CF8AB8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
