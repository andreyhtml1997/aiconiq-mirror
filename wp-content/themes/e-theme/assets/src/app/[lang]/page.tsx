import { setRequestLocale } from 'next-intl/server'
import Layout from '@/components/layout'
import BlockRenderer from '@/components/blocks/block-renderer'
import { fetchPageBySlug, REVALIDATE } from '@/lib/wp'

// Fallback section components for when WP has no `home` page yet
import Hero from '@/components/sections/hero'
import ConsultantSection from '@/components/sections/consultant-section'
import CompetitiveAdvantageHero from '@/components/sections/competitive-advantage-hero'
import MakeImpact from '@/components/sections/make-impact'
import Security from '@/components/sections/security'
import Stats from '@/components/sections/stats'
import SolutionsOverview from '@/components/sections/solutions-overview'
import LeadCaptureTop from '@/components/sections/lead-capture-top'
import LeadCaptureBottom from '@/components/sections/lead-capture-bottom'
import KnowledgeIntro from '@/components/sections/knowledge-intro'
import Knowledge from '@/components/sections/knowledge'
import ProblemAndSolution from '@/components/sections/problem-and-solution'
import AutoVsIntroVideo from '@/components/sections/auto-vs-intro-video'
import AutoVSteamWork from '@/components/sections/autovsteamwork'
import Positioning from '@/components/sections/positioning'
import PositioningBottomSection from '@/components/sections/positioning-bottom'
import Testimonials from '@/components/sections/testimonials'

export const revalidate = REVALIDATE

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  // Try to load a WP Page with slug `home`. If found, render its blocks.
  // Otherwise fall back to the hardcoded section composition.
  const homePage = await fetchPageBySlug('home', lang)
  const hasBlocks = !!homePage?.body_blocks?.length

  return (
    <Layout lang={lang}>
      {hasBlocks ? (
        <BlockRenderer blocks={homePage!.body_blocks} />
      ) : (
        <>
          <Hero />
          <AutoVsIntroVideo />
          <AutoVSteamWork />
          <Positioning />
          <PositioningBottomSection />
          <ProblemAndSolution />
          <KnowledgeIntro />
          <Knowledge />
          <LeadCaptureTop />
          <LeadCaptureBottom />
          <SolutionsOverview />
          <Stats />
          <Testimonials />
          <Security />
          <MakeImpact />
          <CompetitiveAdvantageHero />
          <ConsultantSection />
        </>
      )}
    </Layout>
  )
}
