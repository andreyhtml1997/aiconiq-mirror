import { setRequestLocale } from 'next-intl/server'
import Layout from '@/components/layout'
import Hero from '@/components/sections/hero'
import ConsultantSection from '@/components/sections/consultant-section'
import CompetitiveAdvantageHero from '@/components/sections/competitive-advantage-hero'
import MakeImpact from '@/components/sections/make-impact'
import Security from '@/components/sections/security'
import Stats from '@/components/sections/stats'
import SolutionsOverview from '@/components/sections/solutions-overview'
import LeadCapture from '@/components/sections/lead-capture'
import Knowledge from '@/components/sections/knowledge'
import ProblemAndSolution from '@/components/sections/problem-and-solution'
import AutoVSteamWork from '@/components/sections/autovsteamwork'
import Positioning from '@/components/sections/positioning'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <Layout>
      <Hero />
      <AutoVSteamWork />
      <Positioning />
      <ProblemAndSolution />
      <Knowledge />
      <LeadCapture />
      <SolutionsOverview />
      <Stats />
      <Security />
      <MakeImpact />
      <CompetitiveAdvantageHero />
      <ConsultantSection />
    </Layout>
  )
}
