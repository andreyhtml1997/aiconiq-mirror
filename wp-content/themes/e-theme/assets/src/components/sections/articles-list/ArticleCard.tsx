'use client';

import Link from "next/link";
import { useParams } from "next/navigation";

import ChatButton from "../../ui/ChatButton";
import BadgeIcon from "../../ui/BadgeIcon";

// Типы для hero-медиа
type HeroSliderItem = {
  url: string;
  alt?: string;
  caption?: string;
};

type HeroVideo = {
  url: string;
  filename?: string;
};

interface ArticleCardProps {
  className?: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  date?: string;

  // 🔥 то, что мы теперь пробрасываем из ArticlesList / ArticleCardsCarousel
  heroContentType?: "video" | "images";
  heroSlider?: HeroSliderItem[];
  heroVideo?: HeroVideo | null;
}

const ArticleCard = ({
  className,
  slug,
  title,
  description,
  tags = [],
  date,
  heroContentType,
  heroSlider,
  heroVideo,
}: ArticleCardProps) => {
  // язык берём из URL или, если что, из глобального WP_APP
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || (window as any).WP_APP?.lang || "en";

  // --- Логика превью (видео / картинка / иконка) ---
  const hasVideo =
    heroContentType === "video" && heroVideo && heroVideo.url;

  const hasSlider =
    heroContentType === "images" &&
    heroSlider &&
    heroSlider.length > 0 &&
    !!heroSlider[0].url;

  const firstSlide = hasSlider ? heroSlider![0] : null;

  return (
    <Link
      href={`/${currentLang}/articles/${slug}`}
      className={`bg-[#141112] overflow-hidden rounded-[10px] xs:rounded-[12px] sm:rounded-[14px] md:rounded-[16px] flex flex-col gap-3 xs:gap-4 sm:gap-5 border border-[#FF21B214] p-1.5 xs:p-2 relative h-full transition-all duration-300 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 ${
        className || ""
      }`}
    >
      {/* Превью: видео / картинка / иконка */}
      <div
        className="w-full rounded-[6px] xs:rounded-[8px] bg-[#4234395E] backdrop-blur-2xl border border-[#604B5729] overflow-hidden relative flex items-center justify-center"
        style={{
          minHeight: "clamp(180px, 35vw, 278px)",
          aspectRatio: "16 / 9",
        }}
      >
        {/* VIDEO поверх иконки */}
        {hasVideo && heroVideo?.url && (
          <video
            src={heroVideo.url}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
        )}

        {/* IMAGE поверх иконки, если нет видео */}
        {!hasVideo && firstSlide && firstSlide.url && (
          <img
            src={firstSlide.url}
            alt={firstSlide.alt || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Fallback: если нет ни видео, ни картинок — старая иконка */}
        {!hasVideo && !firstSlide && (
          <BadgeIcon icon="/assets/icons/image.svg" />
        )}
      </div>

      {/* Декор */}
      <img
        src="/assets/lines.svg"
        className="absolute right-0 w-full bottom-1/3 max-w-[350px] hidden md:block z-10 opacity-60 xs:opacity-80 sm:opacity-100 pointer-events-none"
        alt=""
      />
      <img
        src="/assets/aricle-ellipse.webp"
        className="absolute top-0 right-0 hidden md:block opacity-60 xs:opacity-80 sm:opacity-100 pointer-events-none"
        alt=""
      />

      {/* Content section */}
      <div className="flex flex-col items-start gap-4 xs:gap-5 sm:gap-6 md:gap-8 p-2 xs:p-3 sm:p-4 relative flex-1">
        <div className="flex flex-col items-start gap-3 xs:gap-4 sm:gap-5 md:gap-6 flex-1">
          {/* Tags + date */}
          {(tags.length > 0 || date) && (
            <div className="flex items-center justify-between gap-2 w-full">
              {tags.length > 0 && (
                <div className="flex gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="py-0.5 xs:py-1 !flex px-2 xs:px-3 sm:px-4 rounded-full gradient-border-mask22 bg-[#EB3CAE52]"
                    >
                      <span
                        className="gradient-text leading-[160%]"
                        style={{ fontSize: "clamp(12px, 2.5vw, 16px)" }}
                      >
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {date && (
                <span className="text-[#FFFFFF8F] text-[12px] sm:text-[13px] md:text-[14px] whitespace-nowrap">
                  {date}
                </span>
              )}
            </div>
          )}

          {/* Title + description */}
          <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
            <h3
              className="text-white font-semibold leading-[110%]"
              style={{ fontSize: "clamp(18px, 4vw, 28px)" }}
            >
              {title}
            </h3>
            <p
              className="text-[#FFFFFF8F] font-medium leading-[160%] line-clamp-3"
              style={{ fontSize: "clamp(13px, 2.8vw, 16px)" }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="w-full xs:w-auto">
          <ChatButton label="Erfahren Sie mehr" />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
