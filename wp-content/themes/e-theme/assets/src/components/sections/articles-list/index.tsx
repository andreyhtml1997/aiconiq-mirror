'use client';

import SectionHeader from "../../ui/SectionHeader";
import ChatButton from "../../ui/ChatButton";
import ArticleCard from "./ArticleCard";




// Эти типы совпадают с Article из ArticlesPage
type HeroSliderItem = {
  url: string;
  alt?: string;
  caption?: string;
};

type HeroVideo = {
  url: string;
  filename?: string;
};

type Article = {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  heroContentType?: "video" | "images";
  heroSlider?: HeroSliderItem[];
  heroVideo?: HeroVideo | null;
};

interface ArticlesListProps {
  articles: Article[];
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  return (
    <section className="max-w-[1278px] w-full mx-auto flex flex-col py-12 sm:py-16 relative md:py-20 lg:py-[112px] gap-8 sm:gap-10 md:gap-12 items-center justify-center px-4 sm:px-6 md:px-8">
      <img
        src="/assets/lines-article.webp"
        className="absolute top-1/3 -left-1/2 w-full max-w-[550px] -translate-y-1/2"
        alt=""
      />
      <img
        src="/assets/lines-article.webp"
        className="absolute bottom-0 -right-1/3 w-full max-w-[450px] -translate-y-1/2"
        alt=""
      />

      <SectionHeader badge={"Lorem ipsum"} title={"Lorem ipsum dolor sit"} />

      <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              description={article.description}
              tags={article.tags}
              date={article.date}
              heroContentType={article.heroContentType}
              heroSlider={article.heroSlider}
              heroVideo={article.heroVideo}
            />
          ))}
        </div>

        <ChatButton
          onClick={() => console.log("Chat clicked")}
          label="Erfahren Sie mehr"
        />
      </div>
    </section>
  );
};

export default ArticlesList;
