import { setRequestLocale } from 'next-intl/server'
import Layout from '@/components/layout'
import ConsultantSection from '@/components/sections/consultant-section'
import ArticlesHero from '@/components/sections/articles-hero'
import ArticlesList from '@/components/sections/articles-list'
import { Article, WPArticle, stripHtml } from '@/types/article'

// Revalidate every hour (ISR)
export const revalidate = 3600

async function getArticles(lang: string): Promise<Article[]> {
  const restUrl = process.env.NEXT_PUBLIC_WP_REST_URL || '/wp-json/'
  const wpLang = lang === 'en' ? 'en' : 'de'

  // Skip fetching during build if restUrl is relative (no WordPress backend available)
  if (restUrl.startsWith('/')) {
    console.log('Skipping articles fetch - relative WP REST URL (no backend available at build time)')
    return []
  }

  try {
    const res = await fetch(
      `${restUrl}wp/v2/article?per_page=20&_embed&lang=${wpLang}`,
      {
        next: { revalidate: 3600 }, // ISR
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const data: WPArticle[] = await res.json()

    const mapped: Article[] = data.map((item) => {
      const tags =
        item.article_tags && item.article_tags.length
          ? item.article_tags.map((t) => t.name)
          : []

      const heroType = item.hero?.type || item.acf?.hero_content_type

      const heroSlider =
        item.hero?.slider || item.acf?.hero_slider || []

      const heroVideo = item.hero?.video || item.acf?.hero_video || null

      const dateStr = new Date(item.date).toLocaleDateString(
        wpLang === 'de' ? 'de-DE' : 'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      )

      return {
        id: item.id,
        slug: item.slug,
        title: stripHtml(item.title?.rendered || ''),
        description: stripHtml(item.excerpt?.rendered || ''),
        tags,
        date: dateStr,
        heroContentType: heroType,
        heroSlider,
        heroVideo,
      }
    })

    return mapped
  } catch (err) {
    console.error('Failed to load articles', err)
    return []
  }
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  const articles = await getArticles(lang)

  return (
    <Layout lang={lang}>
      <ArticlesHero />
      <ArticlesList articles={articles} />
      <ConsultantSection />
    </Layout>
  )
}
