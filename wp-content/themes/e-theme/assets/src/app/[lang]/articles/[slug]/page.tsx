import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Layout from '@/components/layout'
import ConsultantSection from '@/components/sections/consultant-section'
import ArticlePageHero from '@/components/sections/article-page-hero'
import ArticleCardsCarousel from '@/components/sections/article-cards-carousel'
import ArticleListSteps from '@/components/sections/article-list-steps'
import { WPArticle, stripHtml } from '@/types/article'

// Revalidate every hour (ISR)
export const revalidate = 3600

type HeroTabsItem = {
  title: string
  text: string
}

async function getArticle(slug: string, lang: string): Promise<WPArticle | null> {
  const restUrl = process.env.NEXT_PUBLIC_WP_REST_URL || '/wp-json/'
  const wpLang = lang === 'en' ? 'en' : 'de'

  try {
    const res = await fetch(
      `${restUrl}wp/v2/article?slug=${encodeURIComponent(slug)}&_embed&lang=${wpLang}`,
      {
        next: { revalidate: 3600 }, // ISR
      }
    )

    if (!res.ok) {
      return null
    }

    const data: WPArticle[] = await res.json()
    return data[0] ?? null
  } catch (err) {
    console.error('Failed to load article', err)
    return null
  }
}

async function getRelatedArticles(slug: string, lang: string): Promise<WPArticle[]> {
  const restUrl = process.env.NEXT_PUBLIC_WP_REST_URL || '/wp-json/'
  const wpLang = lang === 'en' ? 'en' : 'de'

  try {
    const res = await fetch(
      `${restUrl}wp/v2/article?per_page=8&_embed&lang=${wpLang}`,
      {
        next: { revalidate: 3600 }, // ISR
      }
    )

    if (!res.ok) {
      return []
    }

    const data: WPArticle[] = await res.json()
    return data.filter((a) => a.slug !== slug)
  } catch (err) {
    console.error('Failed to load related articles', err)
    return []
  }
}

// Generate static params for all articles at build time
export async function generateStaticParams() {
  const restUrl = process.env.NEXT_PUBLIC_WP_REST_URL || '/wp-json/'
  const locales = ['en', 'de']
  const params: Array<{ lang: string; slug: string }> = []

  for (const lang of locales) {
    try {
      const res = await fetch(
        `${restUrl}wp/v2/article?per_page=100&lang=${lang}`,
        {
          next: { revalidate: 3600 },
        }
      )

      if (res.ok) {
        const data: WPArticle[] = await res.json()
        data.forEach((article) => {
          params.push({ lang, slug: article.slug })
        })
      }
    } catch (err) {
      console.error(`Failed to fetch articles for ${lang}`, err)
    }
  }

  return params
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  setRequestLocale(lang)

  const article = await getArticle(slug, lang)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, lang)

  const heroTitle = article?.title?.rendered
    ? article.title.rendered.replace(/<\/?[^>]+(>|$)/g, '')
    : undefined

  const heroExcerpt = article?.excerpt?.rendered
    ? article.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '')
    : undefined

  const heroData = article?.hero
  const heroContentType = heroData?.type
  const heroSlider = heroData?.slider || []
  const heroVideo = heroData?.video || null

  const heroTabs = (heroData as any)?.tabs || (article.acf as any)?.hero_tabs || ([] as HeroTabsItem[])

  const tags =
    article?.article_tags && article.article_tags.length
      ? article.article_tags.map((t) => t.name)
      : undefined

  const heroDate = article?.date
    ? new Date(article.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : undefined

  const carouselArticles = relatedArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: stripHtml(a.title.rendered),
    description: stripHtml(a.excerpt?.rendered || a.content?.rendered || ''),
    tags: [] as string[],
    heroContentType: a.hero?.type,
    heroSlider: a.hero?.slider || [],
    heroVideo: a.hero?.video || null,
  }))

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
  )
}
