import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/navigation";
//@ts-ignore
import "swiper/css/pagination";

import ChatButton from "../../ui/ChatButton";
import ArticleCard from "../articles-list/ArticleCard";

import lines from "../../../assets/lines-article.webp";

interface Article {
  id: number;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  date?: string;
  author?: string;
  heroContentType?: "video" | "images";
  heroSlider?: { url: string; alt?: string; caption?: string }[];
  heroVideo?: { url: string; filename?: string } | null;
}

interface ArticleCardsCarouselProps {
  articles: Article[];
}

const ArticleCardsCarousel = ({ articles }: ArticleCardsCarouselProps) => {
  // если статей нет — просто ничего не рисуем, чтобы не ломать дизайн
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="px-3 xs:px-4 sm:px-6 rounded-[8px] bg-[#141112] py-12 sm:py-16 md:py-20 lg:py-[112px] overflow-hidden relative">
      <img
        src={lines}
        className="absolute top-1/2 left-0 w-full max-w-[450px] -translate-y-1/2"
        alt=""
      />
      <div className="max-w-[1278px] w-full mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[58px] relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
          <h2
            className="font-medium text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] leading-[120%]"
            style={{
              background:
                "linear-gradient(184.14deg, rgba(255, 255, 255, 0.56) 61.8%, rgba(244, 220, 236, 0.56) 96.62%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Lorem ipsum <span className="gradient-text">dolor sit</span>
          </h2>
          <ChatButton
            label="Mehr anzeigen"
            onClick={() => console.log("More articles")}
          />
        </div>

        <div className="relative -mx-3 xs:-mx-4 sm:-mx-6">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView="auto"
            breakpoints={{
              320: {
                spaceBetween: 16,
              },
              640: {
                spaceBetween: 20,
              },
              1024: {
                spaceBetween: 24,
              },
            }}
            className="!overflow-visible"
            style={{
              paddingLeft: "clamp(12px, 3vw, 24px)",
              paddingRight: "clamp(12px, 3vw, 24px)",
              paddingBottom: "48px",
            }}
          >
            {articles.map((article) => (
              <SwiperSlide
                key={article.id}
                style={{
                  width: "clamp(280px, 90vw, 628px)",
                  maxWidth: "628px",
                }}
              >
                <ArticleCard
                  className="bg-[#1F1D1E]"
                  slug={article.slug}
                  title={article.title}
                  description={article.description}
                  tags={article.tags}
                  date={article.date}
                  heroContentType={article.heroContentType}
                  heroSlider={article.heroSlider}
                  heroVideo={article.heroVideo}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ArticleCardsCarousel;
