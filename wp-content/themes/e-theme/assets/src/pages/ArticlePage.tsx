import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout";
import ConsultantSection from "../components/sections/consultant-section";
import ArticlePageHero from "../components/sections/article-page-hero";
import ArticleCardsCarousel from "../components/sections/article-cards-carousel";
import ArticleListSteps from "../components/sections/article-list-steps";

type WPArticleTag = {
  id: number;
  name: string;
  slug: string;
};

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

type HeroTabsItem = {
  title: string;
  text: string;
};

type HeroData = {
  type?: "video" | "images";
  slider?: HeroSliderItem[];
  video?: HeroVideo | null;
  tabs?: HeroTabsItem[];
};

type WPArticle = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date?: string;
  hero?: HeroData; // 🔥 наше новое поле
  content: { rendered: string };
  article_tags?: WPArticleTag[]; // 🔥 вот это важно
};


const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, "").trim();

const ArticlePage = () => {
  const { lang, slug } = useParams<{ lang?: string; slug?: string }>();
  const { i18n } = useTranslation();

  const [article, setArticle] = useState<WPArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<WPArticle[]>([]);

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (!slug) return;

    const restUrl =
      (window as any).WP_APP?.restUrl ?? "/wp-json/";

    const wpLang =
      lang || (window as any).WP_APP?.lang || "en";

    // одна статья
    const url = `${restUrl}wp/v2/article?slug=${encodeURIComponent(
      slug
    )}&_embed&lang=${wpLang}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data: WPArticle[]) => {
        setArticle(data[0] ?? null);
      })
      .catch((err) => {
        console.error("Не вдалося завантажити статтю", err);
        setArticle(null);
      });
  }, [slug, lang]);

  useEffect(() => {
    if (!slug) return;

    const restUrl =
      (window as any).WP_APP?.restUrl ?? "/wp-json/";

    const wpLang =
      lang || (window as any).WP_APP?.lang || "en";

    const url = `${restUrl}wp/v2/article?per_page=8&_embed&lang=${wpLang}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data: WPArticle[]) => {
        const filtered = data.filter((a) => a.slug !== slug);
        setRelatedArticles(filtered);
      })
      .catch((err) => {
        console.error("Не вдалося завантажити пов'язані статті", err);
        setRelatedArticles([]);
      });
  }, [slug, lang]);

  const heroTitle =
  article?.title?.rendered
    ? article.title.rendered.replace(/<\/?[^>]+(>|$)/g, "")
    : undefined;

  const heroExcerpt =
  article?.excerpt?.rendered
    ? article.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")
    : undefined;

  // hero из ACF/REST
  const heroData = article?.hero;
  const heroContentType = heroData?.type;
  const heroSlider = heroData?.slider || [];
  const heroVideo = heroData?.video || null;

  const heroTabs = heroData?.tabs || [];


const tags =
  article?.article_tags && article.article_tags.length
    ? article.article_tags.map((t: WPArticleTag) => t.name)
    : undefined;

  // Дата: форматируем в человекочитаемый вид
  const heroDate = article?.date
    ? new Date(article.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : undefined;


  // мапим WP-статьи в формат, удобный для карусели
  const carouselArticles = relatedArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: stripHtml(a.title.rendered),
    description: stripHtml(a.excerpt?.rendered || a.content?.rendered || ""),
    tags: [] as string[], // позже можно сюда подставить категории/метки
    heroContentType: a.hero?.type,
    heroSlider: a.hero?.slider || [],
    heroVideo: a.hero?.video || null,
  }));

  return (
    <Layout>
      <ArticlePageHero 
        title={heroTitle} 
        excerpt={heroExcerpt} 
        tags={tags}
        heroContentType={heroContentType}
        heroSlider={heroSlider}
        heroVideo={heroVideo}
        date={heroDate}
      />

      <ArticleListSteps tabs={heroTabs} />


      <div className="sm:px-4">
        <ArticleCardsCarousel articles={carouselArticles} />
      </div>

      <ConsultantSection />
    </Layout>
  );
};

export default ArticlePage;
