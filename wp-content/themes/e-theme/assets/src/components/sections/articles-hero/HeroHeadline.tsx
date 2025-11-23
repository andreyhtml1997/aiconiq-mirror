import BadgeIcon from "../../ui/BadgeIcon";
import papers from "../../../assets/icons/papers.svg";

const HeroHeadline = () => {
  return (
    <div className="flex flex-row items-center gap-2 xs:gap-3 sm:gap-1 w-full">
      {/* Avatars section */}
      <div className="flex gap-1 xs:gap-2 sm:gap-[12px] md:gap-[16px]">
        <BadgeIcon icon={papers} hideBoxShadow={true} />
      </div>

      {/* Headline section with button */}
      <div className="gradient-border-mask pr-2 sm:pr-3 max-w-[610px] pl-3 w-full !flex items-center gap-2 sm:gap-3 md:gap-4 justify-between py-1 relative rounded-r-full !overflow-hidden flex-1 min-w-0">
        <div
          className="overflow-hidden absolute bottom-0 right-0 btn-gradeint-back"
          style={{
            width: "clamp(80px, 15vw, 151px)",
            height: "clamp(35px, 8vw, 50px)",
          }}
        />
        <div className="flex items-center gap-[6px] md:gap-[34px] relative whitespace-nowrap flex-shrink min-w-0">
          <span
            className="text-[#FFFFFF] font-medium leading-[120%] truncate"
            style={{ fontSize: "clamp(14px, 3vw, 64px)" }}
          >
            trifft
          </span>
          <span
            className="leading-[120%] font-bold truncate"
            style={{
              fontSize: "clamp(14px, 3vw, 64px)",
              background:
                "linear-gradient(89.75deg, #D45BAA 49.82%, #C60081 99.78%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Intelligenz
          </span>
        </div>

        <button
          className="flex relative items-center btn-shadow justify-center rounded-full bg-[rgba(255,17,172,0.64)] border-[0.5px] border-[#d8008d] transition-all hover:bg-[rgba(255,17,172,0.8)] active:scale-95 flex-shrink-0"
          aria-label="Learn more"
          style={{
            width: "clamp(40px, 7vw, 56px)",
            height: "clamp(40px, 7vw, 56px)",
          }}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-[60%] h-[60%]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66669 16H25.3334M25.3334 16L18.6667 9.33334M25.3334 16L18.6667 22.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroHeadline;
