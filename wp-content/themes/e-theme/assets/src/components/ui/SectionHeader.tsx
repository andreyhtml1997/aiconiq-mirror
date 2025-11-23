import SectionBadge from "./SectionBadge";

interface SectionHeaderProps {
  badge?: string;
  title?: string;
  maxWidth?: string;
  className?: string;
  textClassName?: string;
  middleWord?: string;
}

const SectionHeader = ({
  badge,
  title,
  maxWidth = "820px",
  className = "",
  textClassName = "",
  middleWord,
}: SectionHeaderProps) => {
  return (
    <div
      className={`flex flex-col gap-[26px] items-center justify-center ${className}`}
    >
      {badge && <SectionBadge badge={badge} middleWord={middleWord} />}
      {title ? (
        <h2
          className={`gradient-text font-medium text-[48px] leading-[120%] text-center w-full mx-auto ${textClassName}`}
          style={{
            maxWidth,
            fontSize: "clamp(28px, 4vw, 48px)",
          }}
        >
          {title.split("AICONIQ").map((part, index, array) =>
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
      ) : null}
    </div>
  );
};

export default SectionHeader;
