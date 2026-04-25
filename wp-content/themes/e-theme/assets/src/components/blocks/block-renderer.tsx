import { Block } from '@/types/blocks'
import Hero from '@/components/sections/hero'
import AutoVsIntroVideo from '@/components/sections/auto-vs-intro-video'
import AutoVSteamWork from '@/components/sections/autovsteamwork'
import Positioning from '@/components/sections/positioning'
import PositioningBottomSection from '@/components/sections/positioning-bottom'
import ProblemAndSolution from '@/components/sections/problem-and-solution'
import KnowledgeIntro from '@/components/sections/knowledge-intro'
import Knowledge from '@/components/sections/knowledge'
import LeadCaptureTop from '@/components/sections/lead-capture-top'
import LeadCaptureBottom from '@/components/sections/lead-capture-bottom'
import SolutionsOverview from '@/components/sections/solutions-overview'
import Stats from '@/components/sections/stats'
import Testimonials from '@/components/sections/testimonials'
import Security from '@/components/sections/security'
import MakeImpact from '@/components/sections/make-impact'
import CompetitiveAdvantageHero from '@/components/sections/competitive-advantage-hero'
import ConsultantSection from '@/components/sections/consultant-section'

interface BlockRendererProps {
  blocks?: Block[]
}

const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        const key = `${block.type}-${block.anchor || i}`
        const wrapper = (children: React.ReactNode) => (
          <div key={key} id={block.anchor || undefined}>
            {children}
            {block.divider_below && (
              <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="h-px w-full bg-white/10" />
              </div>
            )}
          </div>
        )

        switch (block.type) {
          case 'hero_main':
            return wrapper(<Hero data={block.data} />)
          case 'auto_vs_intro_video':
            return wrapper(<AutoVsIntroVideo data={block.data} />)
          case 'auto_vs_cards':
            return wrapper(<AutoVSteamWork data={block.data} />)
          case 'positioning_intro':
            return wrapper(<Positioning data={block.data} />)
          case 'positioning_bottom':
            return wrapper(<PositioningBottomSection data={block.data} />)
          case 'problem_solution':
            return wrapper(<ProblemAndSolution data={block.data} />)
          case 'knowledge_intro':
            return wrapper(<KnowledgeIntro data={block.data} />)
          case 'knowledge_steps':
            return wrapper(<Knowledge data={block.data} />)
          case 'lead_capture_top':
            return wrapper(<LeadCaptureTop data={block.data} />)
          case 'lead_capture_bottom':
            return wrapper(<LeadCaptureBottom data={block.data} />)
          case 'solutions_overview':
            return wrapper(<SolutionsOverview data={block.data} />)
          case 'stats':
            return wrapper(<Stats data={block.data} />)
          case 'testimonials':
            return wrapper(<Testimonials data={block.data} />)
          case 'security':
            return wrapper(<Security data={block.data} />)
          case 'make_impact':
            return wrapper(<MakeImpact data={block.data} />)
          case 'competitive_advantage_hero':
            return wrapper(<CompetitiveAdvantageHero data={block.data} />)
          case 'consultant_section':
            return wrapper(<ConsultantSection data={block.data} />)

          case 'text': {
            const { eyebrow, title, body } = block.data
            return wrapper(
              <section className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
                <div className="flex flex-col gap-4 max-w-[860px]">
                  {eyebrow && <span className="gradient-text text-sm sm:text-base leading-[160%]">{eyebrow}</span>}
                  {title && <h2 className="text-white font-semibold leading-[110%]" style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>{title}</h2>}
                  {body && (
                    <div
                      className="text-[#FFFFFF8F] font-medium text-[16px] sm:text-[18px] leading-[170%]"
                      dangerouslySetInnerHTML={{ __html: body }}
                    />
                  )}
                </div>
              </section>
            )
          }

          case 'divider':
            return wrapper(
              <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                {block.data.style === 'glow' ? (
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#EB3CAE] to-transparent opacity-70" />
                ) : (
                  <div className="h-px w-full bg-white/10" />
                )}
              </div>
            )

          default: {
            const _exhaustive: never = block
            return null
          }
        }
      })}
    </>
  )
}

export default BlockRenderer
