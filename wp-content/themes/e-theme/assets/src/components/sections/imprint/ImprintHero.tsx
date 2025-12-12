'use client'
import LangSwitcher from "../../ui/LangSwitcher";
import BadgeIcon from "../../ui/BadgeIcon";

const logo = '/assets/logo.svg'
const image = '/assets/icons/image.svg'

interface ImprintHeroProps {
  title?: string;
  content?: React.ReactNode;
}

const ImprintHero = ({
  title,
  content,
}: ImprintHeroProps) => {

  const mainTitle = title || "Impressum";

  return (
    <section
      id="imprint-hero"
      className="px-3 xs:px-4 sm:px-6 md:px-8 z-20 relative lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex"
      style={{ minHeight: "clamp(750px, 50vh, 800px)" }}
    >
      <div className="bg-[#1F1D1E] p-[1px] rounded-[16px] xs:rounded-[20px] sm:rounded-b-none sm:rounded-[30px] md:rounded-[35px] lg:rounded-[40px] xl:rounded-[47px] flex w-full">
        <div className="w-full rounded-[16px] xs:rounded-[20px] sm:rounded-b-none sm:rounded-[30px] md:rounded-[35px] lg:rounded-[40px] xl:rounded-[47px] !flex flex-col justify-between relative overflow-hidden">
          {/* Centered BadgeIcon with absolute positioning - responsive sizing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 xs:scale-90 sm:scale-100">
            <BadgeIcon icon={image} />
          </div>
          
          {/* Header with logo and language switcher */}
          <div className="flex flex-row p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-[28px] items-start sm:items-center w-full justify-between relative z-20 gap-2 xs:gap-3 sm:gap-4 md:gap-0">
            
            <a href="/" ><img
              src={logo}
              className="w-full"
              style={{ maxWidth: "clamp(100px, 18vw, 193px)" }}
              alt=""
            />
            </a>
            <LangSwitcher />
          </div>

          {/* Content section - responsive layout */}
          <div className="max-w-[1280px] relative w-full mx-auto flex flex-col items-start justify-between gap-4 xs:gap-5 sm:gap-6 md:gap-8 px-3 xs:px-4 sm:px-6 md:px-8 pb-6 xs:pb-8 sm:pb-10 md:pb-12 lg:pb-[65px]">
            <div className="w-full lg:max-w-[1065px] flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-[27px]">
              
              {/* Title */}
              <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                {mainTitle && (
                  <h3
                    className="text-white font-semibold leading-[110%]"
                    style={{ fontSize: "clamp(28px, 8vw, 64px)" }}
                  >
                    {mainTitle}
                  </h3>
                )}
              </div>

              {/* Content */}
              <div className="w-full text-[#FFFFFF8F] leading-[160%] prose prose-invert max-w-none">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImprintHero;