export type WPArticleTag = {
  id: number
  name: string
  slug: string
}

export type HeroSliderItem = {
  url: string
  alt?: string
  caption?: string
}

export type HeroVideo = {
  url: string
  filename?: string
}

export type HeroData = {
  type?: 'video' | 'images'
  slider?: HeroSliderItem[]
  video?: HeroVideo | null
}

export type WPArticle = {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }

  // Custom field hero from register_rest_field
  hero?: HeroData

  // Fallback ACF fields
  acf?: {
    hero_content_type?: 'video' | 'images'
    hero_slider?: HeroSliderItem[]
    hero_video?: HeroVideo | null
    hero_tabs?: any[]
  }

  article_tags?: WPArticleTag[]
}

export type Article = {
  id: number
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  heroContentType?: 'video' | 'images'
  heroSlider?: HeroSliderItem[]
  heroVideo?: HeroVideo | null
}

// Strip HTML tags from strings
export const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim()
