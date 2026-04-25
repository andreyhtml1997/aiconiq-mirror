import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Layout from '@/components/layout'
import BlockRenderer from '@/components/blocks/block-renderer'
import ConsultantSection from '@/components/sections/consultant-section'
import {
  fetchPageBySlug,
  fetchAllPageSlugs,
  isBackendReachable,
  REVALIDATE,
} from '@/lib/wp'

export const revalidate = REVALIDATE

export async function generateStaticParams() {
  if (!isBackendReachable()) return []

  const out: Array<{ lang: string; slug: string }> = []
  for (const lang of ['en', 'de'] as const) {
    const slugs = await fetchAllPageSlugs(lang)
    slugs.forEach((slug) => out.push({ lang, slug }))
  }
  return out
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  setRequestLocale(lang)

  const page = await fetchPageBySlug(slug, lang)
  if (!page) notFound()

  const title = page.title?.rendered?.replace(/<[^>]+>/g, '') ?? ''

  return (
    <Layout lang={lang}>
      {title && (
        <section className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32">
          <h1
            className="text-white font-semibold leading-[110%]"
            style={{ fontSize: 'clamp(32px, 7vw, 56px)' }}
          >
            {title}
          </h1>
        </section>
      )}

      <BlockRenderer blocks={page.body_blocks} />

      <ConsultantSection />
    </Layout>
  )
}
