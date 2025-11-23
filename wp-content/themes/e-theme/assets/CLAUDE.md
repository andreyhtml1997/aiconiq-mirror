# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev        # Start development server (accessible on network with --host)
npm run build      # TypeScript compilation + Vite production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

**Note**: No testing framework is currently configured.

## Architecture Overview

**Project**: AICONIQ - Marketing/landing page for AI solutions company

**Stack**: React 18.3 + TypeScript + Vite + Tailwind CSS 4.0

**Key Libraries**:
- React Router DOM 7.9 (routing with language parameter)
- i18next (internationalization - English & German)
- Framer Motion 12.0 (animations)
- Zustand (state management - minimal usage)
- Swiper (carousel/slider)

**Pattern**: Component-based SPA with route-based language switching and section-based page composition.

## Component Organization

**IMPORTANT**: Always split components into separate files. Do not put multiple components in one file.

**Structure**:
```
src/
├── components/
│   ├── layout/          # Footer, Header
│   ├── sections/        # 14 major page sections (Hero, Knowledge, Security, etc.)
│   │   └── [section]/   # Each section in its own folder with sub-components split
│   └── ui/              # Reusable UI components (ChatButton, SectionBadge, etc.)
├── pages/               # HomePage.tsx composes sections
├── routes/              # AppRoutes.tsx defines routing logic
├── locales/             # i18n translations (en/ and de/)
└── assets/              # Images, SVGs, icons
```

**HomePage Composition**: The main page (src/pages/HomePage.tsx) renders 12 sections in sequence:
1. Hero (with Navigation)
2. AutoVSteamWork
3. Positioning
4. ProblemAndSolution
5. Knowledge
6. LeadCapture
7. SolutionsOverview
8. Stats
9. Security
10. MakeImpact
11. CompetitiveAdvantageHero
12. ConsultantSection

## Internationalization (i18n)

**Languages**: German (de) is default, English (en) also supported

**Structure**:
- Translation files: `src/locales/{lang}/{section}.json`
- Consolidated exports: `src/locales/{lang}/index.ts`
- i18n config: `i18n.ts` at root

**Key Pattern**: Translation keys follow structure `section.subsection.property`

**When adding/modifying text**:
1. Add keys to both `locales/en/{section}.json` and `locales/de/{section}.json`
2. Import in respective `index.ts` files
3. Access via `useTranslation()` hook in components

## Routing & Language Switching

**Route Structure**:
- "/" → Redirects to "/de" (German default)
- "/:lang" → Renders HomePage with language parameter

**Flow**:
1. `src/main.tsx` → Entry point with BrowserRouter
2. `src/App.tsx` → Imports i18n config, renders AppRoutes
3. `src/routes/AppRoutes.tsx` → Route definitions with language parameter
4. `src/pages/HomePage.tsx` → Detects language from URL params, changes i18n language

**Language detection**: i18next-browser-languagedetector automatically detects browser language, but route parameter takes precedence.

## Styling Approach

**Primary**: Tailwind CSS 4.0 utility-first approach

**Custom Utilities** (in `src/index.css`):
- Gradient borders and text effects
- Custom shadows and glows
- Typography utilities
- Marquee animations

**Custom Animations** (in `tailwind.config.js`):
- `marquee`: Horizontal scrolling
- `marquee-vertical`: Vertical scrolling

**Font**: Manrope (Google Fonts) as primary typeface

**Color Scheme**: Dark theme with pink/purple accents

## Key Technical Details

**TypeScript**: Strict mode enabled, target ES2020, no unused variables/parameters allowed

**Navigation**: Smooth scroll behavior implemented via DOM manipulation for section navigation

**Deployment**: Configured for Vercel with SPA rewrite rules (vercel.json)

**Entry Point**: `src/main.tsx` → `src/App.tsx` → `src/routes/AppRoutes.tsx` → `src/pages/HomePage.tsx`

## Framer Motion Animations

Animations are extensively used throughout the site. Common patterns:
- Fade in on scroll with `initial`, `whileInView`, `viewport` props
- Staggered children animations
- Scroll-triggered reveals

When adding new sections, follow existing animation patterns for consistency.
