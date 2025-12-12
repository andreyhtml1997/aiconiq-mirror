'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/effect-fade";

import Navigation from "../hero/navigation";
import LangSwitcher from "../../ui/LangSwitcher";
import ChatButton from "../../ui/ChatButton";
import BadgeIcon from "../../ui/BadgeIcon";

const logo = '/assets/logo.svg'
const image = '/assets/icons/image.svg'

interface ArticlePageHeroProps {
  title?: string;
  excerpt?: string;
  tags?: string[];
}

type HeroSliderItem = {
  id?: number;
  url: string;
  alt?: string;
  caption?: string;
};

type HeroVideo = {
  url: string;
  filename?: string;
};

interface ArticlePageHeroProps {
  title?: string;
  excerpt?: string;
  tags?: string[];
  heroContentType?: "video" | "images";
  heroSlider?: HeroSliderItem[];
  heroVideo?: HeroVideo | null;
  date?: string; // 🔥 добавили
}

const ArticlePageHero = ({
  title,
  excerpt,
  tags,
  heroContentType,
  heroSlider,
  heroVideo,
  date,
}: ArticlePageHeroProps) => {

  const mainTitle = title || "";
  const mainExcerpt = excerpt || "";

    // если tags не переданы — показываем 2 LOREM, как раньше
  const displayTags = tags && tags.length ? tags : [];

  const hasVideo =
    heroContentType === "video" && heroVideo && heroVideo.url;
  const hasSlider =
    heroContentType === "images" &&
    heroSlider &&
    heroSlider.length > 0;

  return (
    <section
      id="article-hero"
      className="px-3 xs:px-4 sm:px-6 md:px-8 z-20 relative lg:px-10 pt-3 xs:pt-4 sm:pt-6 justify-center w-full flex"
      style={{ minHeight: "clamp(750px, 50vh, 800px)" }}
    >
      <div className="bg-[#1F1D1E] p-[1px] rounded-[16px] xs:rounded-[20px] sm:rounded-b-none sm:rounded-[30px] md:rounded-[35px] lg:rounded-[40px] xl:rounded-[47px] flex w-full">
        <div className="w-full rounded-[16px] xs:rounded-[20px] sm:rounded-b-none sm:rounded-[30px] md:rounded-[35px] lg:rounded-[40px] xl:rounded-[47px] !flex flex-col justify-between relative overflow-hidden">
          {/* Centered BadgeIcon with absolute positioning - responsive sizing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 xs:scale-90 sm:scale-100">
            <BadgeIcon icon={image} />
          </div>
                {hasVideo && heroVideo?.url && (
                  <div className="video-container absolute inset-0 w-full h-full  object-cover rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]">
                    <video
                      src={heroVideo.url}
                      className="inset-0 w-full h-full  object-cover"
                      autoPlay
                      muted
                      loop
                    />
                  </div>
                )}

                {hasSlider && heroSlider && heroSlider.length > 0 && (
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  slidesPerView={1}
                  effect="fade"
                  loop={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  className="absolute inset-0 w-full h-full rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]"
                >
                  {heroSlider.map((slide, index) => (
                    <SwiperSlide key={slide.id ?? index}>
                      <img
                        src={slide.url}
                        alt={slide.alt || ""}
                        className="w-full h-full object-cover rounded-t-[20px] sm:rounded-b-none xs:rounded-t-[30px] sm:rounded-t-[35px] md:rounded-t-[40px] lg:rounded-t-[47px]"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
          {/* Header with logo and navigation */}
          <div className="flex flex-row p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-[28px] items-start sm:items-center w-full justify-between relative z-20 gap-2 xs:gap-3 sm:gap-4 md:gap-0">
            <a href="/" ><img
              src={logo}
              className="w-full"
              style={{ maxWidth: "clamp(100px, 18vw, 193px)" }}
              alt=""
            />
            </a>
            <LangSwitcher />
            <div className="hidden md:flex md:items-center md:gap-6">
              <Navigation />
            </div>
          </div>

          {/* Content section - responsive layout */}
          <div className="max-w-[1280px] relative w-full mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 xs:gap-5 sm:gap-6 md:gap-8 px-3 xs:px-4 sm:px-6 md:px-8 pb-6 xs:pb-8 sm:pb-10 md:pb-12 lg:pb-[65px]">
            <div className="w-full lg:max-w-[1065px] flex flex-col gap-4 xs:gap-5 sm:gap-6 md:gap-[27px]">
              

              <div className="w-full flex flex-col gap-4">

              </div>

              {/* Tags + date */}
              {(displayTags.length > 0 || date) && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {displayTags.length > 0 && (
                    <div className="flex gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap">
                      {displayTags.map((tag, index) => (
                        <div
                          key={index}
                          className="py-0.5 xs:py-1 !flex px-2 xs:px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]"
                        >
                          <span
                            className="gradient-text leading-[160%]"
                            style={{ fontSize: "clamp(11px, 2.5vw, 16px)" }}
                          >
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {date && (
                    <span
                      className="text-[#FFFFFF8F] leading-[160%]"
                      style={{ fontSize: "clamp(11px, 2.5vw, 16px)" }}
                    >
                      {date}
                    </span>
                  )}
                </div>
              )}

              {/* Title and description - fully responsive */}
              <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                {mainTitle && (
                  <h3
                    className="text-white font-semibold leading-[110%]"
                    style={{ fontSize: "clamp(28px, 8vw, 64px)" }}
                  >
                    {mainTitle}
                  </h3>
                )}

                {mainExcerpt && (
                  <p
                    className="text-[#FFFFFF8F] font-medium leading-[160%] max-w-full lg:max-w-[730px] w-full line-clamp-3 sm:line-clamp-4"
                    style={{ fontSize: "clamp(14px, 2.5vw, 16px)" }}
                  >
                    {mainExcerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Button - full width on mobile, auto on desktop */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <ChatButton label="Erfahren Sie mehr" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlePageHero;
