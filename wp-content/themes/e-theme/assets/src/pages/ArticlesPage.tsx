import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout";
import ConsultantSection from "../components/sections/consultant-section";
import ArticlesHero from "../components/sections/articles-hero";
import ArticlesList from "../components/sections/articles-list";

type WPArticleTag = {
  id: number;
  name: string;
  slug: string;
};

type HeroSliderItem = {
  url: string;
  alt?: string;
  caption?: string;
};

type HeroVideo = {
  url: string;
  filename?: string;
};

type HeroData = {
  type?: "video" | "images";
  slider?: HeroSliderItem[];
  video?: HeroVideo | null;
};

type WPArticle = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };

  // 🔥 наше кастомное поле hero из register_rest_field
  hero?: HeroData;

  // запасной вариант — сырые ACF-поля (если вдруг hero нет)
  acf?: {
    hero_content_type?: "video" | "images";
    hero_slider?: HeroSliderItem[];
    hero_video?: HeroVideo | null;
  };

  article_tags?: WPArticleTag[];
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

// убираем HTML-теги из title / excerpt
const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, "").trim();

const ArticlesPage = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  const [articles, setArticles] = useState<Article[]>([]);

  // язык для i18next
  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // 🔥 тянем статьи конкретного языка и маппим их под ArticleCard
  useEffect(() => {
    const restUrl = (window as any).WP_APP?.restUrl ?? "/wp-json/";

    const wpLang =
      lang || (window as any).WP_APP?.lang || "en";

    const url = `${restUrl}wp/v2/article?per_page=20&_embed&lang=${wpLang}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data: WPArticle[]) => {
        const mapped: Article[] = data.map((item) => {
          const tags =
            item.article_tags && item.article_tags.length
              ? item.article_tags.map((t) => t.name)
              : [];

          // 🔥 сначала пробуем hero.*, если его нет — падаем в acf.*
          const heroType =
            item.hero?.type || item.acf?.hero_content_type;

          const heroSlider =
            item.hero?.slider ||
            item.acf?.hero_slider ||
            [];

          const heroVideo =
            item.hero?.video ||
            item.acf?.hero_video ||
            null;

          const dateStr = new Date(item.date).toLocaleDateString(
            wpLang === "de" ? "de-DE" : "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );

          return {
            id: item.id,
            slug: item.slug,
            title: stripHtml(item.title?.rendered || ""),
            description: stripHtml(item.excerpt?.rendered || ""),
            tags,
            date: dateStr,
            heroContentType: heroType,
            heroSlider,
            heroVideo,
          };
        });

        setArticles(mapped);
      })
      .catch((err) => {
        console.error("Не вдалося завантажити статті", err);
      });
  }, [lang]);

  return (
    <Layout>
      <ArticlesHero />
      <ArticlesList articles={articles} />
      <ConsultantSection />
    </Layout>
  );
};

export default ArticlesPage;
