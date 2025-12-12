'use client';

import { useTranslations } from "next-intl";
import Navigation from "../hero/navigation";
import LangSwitcher from "../../ui/LangSwitcher";
import HeroHeadline from "./HeroHeadline";

const ArticlesHero = () => {
  const t = useTranslations();

  return (
    <section
      id="articles-hero"
      className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex"
      style={{ minHeight: "clamp(500px, 80vh, 917px)" }}
    >
      <div className="bg-color-black p-[1px] rounded-[20px] sm:rounded-b-none xs:rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[47px] flex w-full">
        <div className="w-full rounded-[20px] xs:rounded-[30px] sm:rounded-b-none sm:rounded-[35px] bg-black md:rounded-[40px] lg:rounded-[47px] !flex flex-col justify-between relative overflow-hidden">
          {/* Background Image */}
          <img
            src="/assets/hero/article-hero.webp"
            className="absolute inset-0 w-full h-full object-cover rounded-[20px] sm:rounded-b-none xs:rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[47px]"
            alt=""
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 rounded-[20px] sm:rounded-b-none xs:rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[47px] pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(102.08% 102.07% at 50.73% 0%, rgba(0, 0, 0, 0) 41.02%, #000000 95.66%), radial-gradient(80.27% 340.83% at 78.8% 44.85%, rgba(0, 0, 0, 0) 47.54%, #000000 100%), linear-gradient(174.81deg, rgba(0, 0, 0, 0.4) 6.08%, rgba(0, 0, 0, 0) 35.58%)`,
            }}
          />

          <div className="flex flex-row p-3 xs:p-4 sm:p-5 md:p-6 lg:p-[28px] items-start sm:items-center w-full justify-between relative z-10 gap-3 xs:gap-4 sm:gap-0">
            
            <a href="/" ><img
              src="/assets/logo.svg"
              className="w-full"
              style={{ maxWidth: "clamp(120px, 20vw, 193px)" }}
              alt=""
            />
            </a>
            <LangSwitcher />
            <div className="hidden md:flex md:items-center md:gap-6">
              
              <Navigation />
            </div>
          </div>

          <div
            className="flex flex-col pb-10 md:pb-[95px] relative z-10 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12"
            style={{ gap: "clamp(2rem, 8vw, 83px)" }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
              <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full lg:max-w-[900px]">
                <h1
                  style={{
                    background:
                      "linear-gradient(184.14deg, #FFFFFF 61.8%, #F4DCEC 96.62%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    fontSize: "clamp(24px, 5vw, 64px)",
                  }}
                  className="leading-[120%] font-medium"
                >
                  {t("articlesHero.mainHeading")}
                </h1>
                <HeroHeadline />
              </div>

              <p
                className="max-w-full lg:max-w-[416px] w-full text-left lg:text-right text-[#FFFFFF8F] leading-[160%]"
                style={{ fontSize: "clamp(12px, 1.2vw, 16px)" }}
              >
                Ideen, Strategien und Cases für digitale Mitarbeiter. Weniger
                Aufwand, mehr Wirkung. Klar, praxisnah, zukunftsorientiert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesHero;
