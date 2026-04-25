// Blocks shipped by /wp-json/wp/v2/{article|page}.
// Mirrors the PHP normalizers in functions/rest-blocks.php.

export type WPImage = {
  id: number | null
  url: string
  alt: string
  width?: number | null
  height?: number | null
}

export type WPFile = {
  id: number | null
  url: string
  mime?: string | null
  filename?: string
}

export type WPLink = {
  url: string
  title?: string
  target?: string
}

export type ButtonData = {
  label: string
  mode: 'action' | 'url'
  url: WPLink | null
}

export type BlockBase = {
  anchor: string
  divider_below: boolean
}

type Wrap<T extends string, D> = BlockBase & { type: T; data: D }

// ---------- 1. HERO MAIN ----------
export type HeroStat = { pre_value: string; value: string; label: string }
export type HeroMainData = {
  main_heading: string
  we_deliver: string
  digital_employees: string
  description: string
  video: WPFile | null
  image: WPImage | null
  stats: HeroStat[]
  avatars: WPImage[]
  logo: WPImage | null
  cta: ButtonData | null
}
export type HeroMainBlock = Wrap<'hero_main', HeroMainData>

// ---------- 2a. AUTO VS — INTRO VIDEO ----------
export type AutoVsIntroVideoData = { video: WPFile | null }
export type AutoVsIntroVideoBlock = Wrap<'auto_vs_intro_video', AutoVsIntroVideoData>

// ---------- 2b. AUTO VS — TEXT + 2 CARDS ----------
export type AvsAutomation = {
  badge: string; heading: string; description: string
  use_cases_title: string; use_cases: string[]
  example_title: string; example_p1: string; example_p2: string
  result_label: string; result_value: string; result_description: string
  result_icon: WPImage | null
}
export type AvsCollaboration = {
  badge: string; heading: string; description: string
  use_cases_title: string; use_cases: string[]
  example_title: string; example_paragraph: string
  conclusion_title: string; conclusion_text: string
  cta: ButtonData | null
}
export type AutoVsCardsData = {
  badge: string; middle_word: string; title: string; description: string
  automation: AvsAutomation
  collaboration: AvsCollaboration
}
export type AutoVsCardsBlock = Wrap<'auto_vs_cards', AutoVsCardsData>

// ---------- 3a. POSITIONING — INTRO + LEFT/RIGHT ----------
export type PositioningIntroData = {
  badge: string; title: string; description: string
  left_block: { badge: string; title: string; description: string; icon: WPImage | null }
  right_block: { overlay_text: string; description: string; image: WPImage | null }
}
export type PositioningIntroBlock = Wrap<'positioning_intro', PositioningIntroData>

// ---------- 3b. POSITIONING — BOTTOM ----------
export type PositioningBottomData = {
  title: string; badge: string; description: string
  result_label: string; result_title: string; result_description: string
}
export type PositioningBottomBlock = Wrap<'positioning_bottom', PositioningBottomData>

// ---------- 4. PROBLEM & SOLUTION ----------
export type ProblemSolutionCard = {
  label: string
  icon: WPImage | null
  image: WPImage | null
  features: string[]
  quality_label: string
  quality_value: string
}
export type ProblemSolutionData = {
  badge: string; middle_word: string; title: string
  description1: string; description2: string
  accuracy_text: string
  cta: ButtonData | null
  how_it_works: string
  cards: ProblemSolutionCard[]
}
export type ProblemSolutionBlock = Wrap<'problem_solution', ProblemSolutionData>

// ---------- 5a. KNOWLEDGE — INTRO ----------
export type KnowledgeIntroData = {
  badge: string; title: string
  video: WPFile | null
}
export type KnowledgeIntroBlock = Wrap<'knowledge_intro', KnowledgeIntroData>

// ---------- 5b. KNOWLEDGE — STEPS ----------
export type KnowledgeAnimationType = 'card1' | 'card2' | 'card3' | 'card4' | 'video'
export type KnowledgeStep = {
  icon: WPImage | null
  animation_type: KnowledgeAnimationType
  title: string
  description: string
  video: WPFile | null
}
export type KnowledgeStepsData = {
  steps: KnowledgeStep[]
  button: ButtonData | null
}
export type KnowledgeStepsBlock = Wrap<'knowledge_steps', KnowledgeStepsData>

// ---------- 6a. LEAD CAPTURE — TOP ----------
export type LeadCaptureTopData = {
  title_part1: string; title_highlight: string; title_part2: string
  description: string; button: ButtonData | null
  video: WPFile | null; banner: WPImage | null
}
export type LeadCaptureTopBlock = Wrap<'lead_capture_top', LeadCaptureTopData>

// ---------- 6b. LEAD CAPTURE — BOTTOM ----------
export type LeadCaptureBottomData = {
  title: string; button: ButtonData | null
  image: WPImage | null; background: WPImage | null
}
export type LeadCaptureBottomBlock = Wrap<'lead_capture_bottom', LeadCaptureBottomData>

// ---------- 7. SOLUTIONS OVERVIEW ----------
export type SolutionItem = { icon: WPImage | null; title: string; description: string }
export type SolutionsOverviewData = {
  title: string; button: ButtonData | null; solutions: SolutionItem[]
}
export type SolutionsOverviewBlock = Wrap<'solutions_overview', SolutionsOverviewData>

// ---------- 8. STATS ----------
export type StatItem = { value: string; description: string }
export type StatsData = { top_stats: StatItem[]; bottom_stats: StatItem[] }
export type StatsBlock = Wrap<'stats', StatsData>

// ---------- 9. TESTIMONIALS ----------
export type TestimonialItem = {
  icon: WPImage | null
  name: string
  description: string
  video: WPFile | null
  reverse: boolean
}
export type TestimonialsData = { badge: string; title: string; items: TestimonialItem[] }
export type TestimonialsBlock = Wrap<'testimonials', TestimonialsData>

// ---------- 10. SECURITY ----------
export type SecurityCardData = {
  title: string; description: string
  badge: string; highlight: string
  image: WPImage | null
}
export type SecurityData = {
  badge: string; title: string; description1: string; description2: string
  cards: SecurityCardData[]
}
export type SecurityBlock = Wrap<'security', SecurityData>

// ---------- 11. MAKE IMPACT ----------
export type MakeImpactData = {
  badge: string; title: string; coming_soon: string; team_image: WPImage | null
}
export type MakeImpactBlock = Wrap<'make_impact', MakeImpactData>

// ---------- 12. COMPETITIVE ADVANTAGE HERO ----------
export type CompetitiveAdvantageHeroData = {
  title: string; description: string; button: ButtonData | null
  logo: WPImage | null; banner: WPImage | null
}
export type CompetitiveAdvantageHeroBlock = Wrap<'competitive_advantage_hero', CompetitiveAdvantageHeroData>

// ---------- 13. CONSULTANT SECTION ----------
export type ConsultantSectionData = {
  title: string; button: ButtonData | null
  avatars: WPImage[]
  consult_logo: WPImage | null
  back_logo: WPImage | null
}
export type ConsultantSectionBlock = Wrap<'consultant_section', ConsultantSectionData>

// ---------- FOOTER (lives on ACF Options Page, not in body_blocks) ----------
export type FooterLink = { name: string; url: string }
export type FooterSocial = { name: string; url: string }
export type FooterData = {
  logo: WPImage | null
  big_logo: WPImage | null
  description: string
  email: string
  social_label: string
  links_label: string
  socials: FooterSocial[]
  links: FooterLink[]
}

// ---------- UNIVERSAL ----------
export type TextData = { eyebrow: string; title: string; body: string }
export type TextBlock = Wrap<'text', TextData>

export type DividerData = { style: 'line' | 'glow' }
export type DividerBlock = Wrap<'divider', DividerData>

// ---------- UNION ----------
export type Block =
  | HeroMainBlock
  | AutoVsIntroVideoBlock
  | AutoVsCardsBlock
  | PositioningIntroBlock
  | PositioningBottomBlock
  | ProblemSolutionBlock
  | KnowledgeIntroBlock
  | KnowledgeStepsBlock
  | LeadCaptureTopBlock
  | LeadCaptureBottomBlock
  | SolutionsOverviewBlock
  | StatsBlock
  | TestimonialsBlock
  | SecurityBlock
  | MakeImpactBlock
  | CompetitiveAdvantageHeroBlock
  | ConsultantSectionBlock
  | TextBlock
  | DividerBlock

export type BlockType = Block['type']

export const isMeaningfulText = (s: string | undefined | null): boolean =>
  !!s && s.replace(/<[^>]+>/g, '').trim().length > 0
