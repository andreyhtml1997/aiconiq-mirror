// Centralized WordPress REST client for server components.
// Skips remote calls during build when restUrl is relative — keeps
// `next build` from failing without a backend.

export const REVALIDATE = 5

export function wpBaseUrl(): string {
  return process.env.NEXT_PUBLIC_WP_REST_URL || '/wp-json/'
}

export function wpLang(lang: string): 'en' | 'de' {
  return lang === 'en' ? 'en' : 'de'
}

export function isBackendReachable(): boolean {
  return !wpBaseUrl().startsWith('/')
}

async function wpFetchJSON<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!isBackendReachable()) {
    return null
  }

  try {
    const url = wpBaseUrl().replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      ...init,
    })
    if (!res.ok) {
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error('wp fetch failed', path, err)
    return null
  }
}

import type { WPArticle } from '@/types/article'

export type WPPage = {
  id: number
  slug: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  body_blocks?: import('@/types/blocks').Block[]
}

export type MenuItem = {
  id: number
  label: string
  url: string
  target: string
  kind: 'anchor' | 'link'
  object: string
  object_id: number
  children: MenuItem[]
}

export async function fetchMenu(
  location: string,
  lang: string
): Promise<MenuItem[]> {
  const data = await wpFetchJSON<MenuItem[]>(
    `aiconiq/v1/menu/${location}?lang=${wpLang(lang)}`
  )
  return data || []
}

export async function fetchArticles(lang: string): Promise<WPArticle[]> {
  const data = await wpFetchJSON<WPArticle[]>(
    `wp/v2/article?per_page=20&_embed&lang=${wpLang(lang)}`
  )
  return data || []
}

export async function fetchArticleBySlug(
  slug: string,
  lang: string
): Promise<WPArticle | null> {
  const data = await wpFetchJSON<WPArticle[]>(
    `wp/v2/article?slug=${encodeURIComponent(slug)}&_embed&lang=${wpLang(lang)}`
  )
  return (data && data[0]) || null
}

export async function fetchPageBySlug(
  slug: string,
  lang: string
): Promise<WPPage | null> {
  const data = await wpFetchJSON<WPPage[]>(
    `wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed&lang=${wpLang(lang)}`
  )
  return (data && data[0]) || null
}

export async function fetchAllPageSlugs(lang: string): Promise<string[]> {
  const data = await wpFetchJSON<WPPage[]>(
    `wp/v2/pages?per_page=100&lang=${wpLang(lang)}&_fields=slug`
  )
  return data ? data.map((p) => p.slug) : []
}

import type { FooterData } from '@/types/blocks'

export async function fetchSiteFooter(lang: string): Promise<FooterData | null> {
  return await wpFetchJSON<FooterData>(`aiconiq/v1/footer?lang=${wpLang(lang)}`)
}
