# AICONIQ — Setup & content workflow

A Next.js 16 (App Router, next-intl) front-end living in `assets/`, fed
content by WordPress + ACF Pro + Polylang Pro through the REST API.
Public site is rendered by Next.js. WordPress is admin + REST only.

---

## 1. First-time install (no DB import)

We don't ship a database — content is recreated by the seeder.

1. **WordPress**

   - Activate plugins: **ACF Pro**, **Polylang Pro**, **Classic Editor**, **SVG Support**.
   - In Polylang, set up two languages: **English (en)** and **Deutsch (de)**.
   - Activate the `e-theme` theme.

2. **Front-end**

   ```bash
   cd wp-content/themes/e-theme/assets
   cp .env.example .env.local        # then edit:
   #   NEXT_PUBLIC_WP_REST_URL=http://your-wp-host/wp-json/
   #   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/pg-aiconiq/30min
   npm install
   npm run build
   npm run dev          # http://localhost:3000
   ```

3. **Run the seeder** (creates everything):

   **WP Admin → Tools → AICONIQ: Seed home page → Run seeder**

   The seeder is idempotent. One press creates:

   - 33 images + 5 videos downloaded from `aiconiq.io` into Media Library
     (deduped by `_aiconiq_source_url` post meta — re-running won't refetch).
   - **Pages:** `Home (EN)` and `Home (DE)` (slug `home` in both,
     linked via Polylang). Both use the **Blocks (Next.js)** page template.
   - **Body blocks:** all 17 sections, EN + DE, populated with the
     verbatim text from `aiconiq.io`.
   - **Footer options:** populated for EN + DE on the Footer Options pages.
   - **Menus:** `Primary EN`, `Primary DE`, `Footer EN`, `Footer DE`,
     assigned to `primary` and `footer` theme locations via Polylang.

   **⚠️ Re-running the seeder OVERWRITES** all current content on
   `Home (EN)` / `Home (DE)`, footer options and menus. Don't run it
   on a database with manual edits you want to keep.

---

## 2. Day-to-day editing

### 2.1 Page blocks

Pages with a body composed of front-end blocks use the
**"Blocks (Next.js)"** page template. Right now only the Home page does.

**Edit:** Pages → Home (EN) → scroll to the **Blocks** meta box →
drag/drop layouts, fill fields, Update. Same for Home (DE).

The ACF group `body_blocks` is **only attached to pages that use the
Blocks (Next.js) template** — articles and ordinary pages keep their
default UI. To opt another page in: open it, in the right sidebar set
*Page Attributes → Template* → "Blocks (Next.js)", Update.

### 2.2 Sync block order across languages

After reordering blocks on **Home (EN)**, you don't have to manually
mirror the order on Home (DE). On the page editor (right sidebar),
click **"Sync block order to translations"** in the *Sync block order*
meta box. The button reorders blocks on every linked translation to
match the current page's order. **Per-language text and media stay
independent — only the order moves.** Matching is by layout type.

### 2.3 Header & footer menus

Configured under **Appearance → Menus**:

| Menu name    | Language | Theme location | Purpose                                |
|--------------|----------|----------------|----------------------------------------|
| Primary EN   | English  | Primary        | Sticky header on EN pages              |
| Primary DE   | Deutsch  | Primary        | Sticky header on DE pages              |
| Footer EN    | English  | Footer         | Bottom-of-page legal links on EN       |
| Footer DE    | Deutsch  | Footer         | Bottom-of-page legal links on DE       |

Add a custom anchor link by setting the URL to e.g. `#solutions` —
the front-end smooth-scrolls to the matching block anchor on the home
page (anchors are set per block in the Blocks editor).

The seeder pre-fills both menus with the standard nav items + Blog
external link.

### 2.4 Footer content (logo, description, socials, links)

Lives on a dedicated top-level admin menu: **Footer → Footer (EN)** and
**Footer → Footer (DE)**. Two ACF Options pages, one per language —
because Polylang Pro doesn't translate Options Page values natively.

Fields: top logo, big bottom logo, description, contact email,
social-links repeater, footer-links repeater, plus the section labels
("Socials" / "Links").

### 2.5 Articles

Articles are a separate CPT (`article`) with their own ACF fields
(`hero_content_type`, `hero_video`, `hero_slider`, `Tabs`) — defined
elsewhere, **untouched by the body_blocks system**. Edit at
`Articles` in the admin sidebar, render on the front-end at
`/{lang}/articles/[slug]`.

---

## 3. What the seeder does, exactly

`functions/admin-setup.php` adds the *Tools → AICONIQ: Seed home page*
admin page. The runner is `setup/seed-home.php` →
`aiconiq_seed_home_run()`:

1. Imports 33 images + 5 videos from `aiconiq.io` (skips already-imported).
2. Upserts `Home (EN)` page (slug `home`, language EN,
   template `page-templates/blocks.php`).
3. Upserts `Home (DE)` page (slug `home`, language DE, linked to EN
   via Polylang, template `page-templates/blocks.php`).
4. Writes `body_blocks` arrays — 17 layouts in defined order — for both pages.
5. Writes Footer options for both `aiconiq_footer_en` and `aiconiq_footer_de`.
6. Wipes & recreates `Primary EN/DE`, `Footer EN/DE` menus and assigns
   them to theme locations via Polylang's `nav_menus` mapping.

**Not seeded:**

- ACF field schemas (those live in PHP — `functions/acf-blocks.php`,
  `functions/acf-footer-options.php` — and load on plugin init).
- Articles — none are created.
- WordPress general settings, users, plugin settings.

---

## 4. Key file map

```
e-theme/
├── functions.php                   loads everything below
├── functions/
│   ├── acf.php                     CPT 'article' + REST hero fields
│   ├── acf-blocks.php              ACF flexible content "body_blocks"
│   │                               (location: Blocks (Next.js) template only)
│   ├── acf-footer-options.php      Top-level "Footer" options menu (EN/DE)
│   ├── rest-blocks.php             Per-layout REST normalizers
│   ├── menu.php                    Menu locations + REST + dedupe
│   ├── sync-blocks-order.php       "Sync block order" meta box + AJAX
│   ├── admin-setup.php             Tools → AICONIQ Seed page
│   ├── enqueues.php / cleanup.php / setup.php
├── page-templates/
│   └── blocks.php                  Page template that opts a page into ACF blocks
├── setup/
│   └── seed-home.php               Idempotent content seeder
├── assets/                         Next.js 16 app (SSR + ISR)
│   ├── src/app/[lang]/page.tsx     Home — fetches body_blocks via REST
│   ├── src/components/blocks/      BlockRenderer
│   ├── src/components/sections/    1-to-1 with the 17 ACF layouts
│   ├── src/lib/wp.ts               REST client + lang helpers
│   ├── src/types/blocks.ts         TS types (mirror PHP normalizers)
│   ├── .env.local                  Per-env config (gitignored)
│   └── .env.example                Template
```

---

## 5. Common gotchas

- **Edits disappear after running seeder again.** That's by design —
  seeder is for first-time setup, not ongoing maintenance.
- **New CTA in Hero / right card of "Automation vs" → after seeder** is
  empty, since seeder doesn't write those new fields. Fill in admin.
- **Calendly opens "Page not found".** `NEXT_PUBLIC_CALENDLY_URL` is
  unset or wrong in `.env.local`. The fallback is
  `https://calendly.com/pg-aiconiq/30min` (production URL).
- **Menu items appear twice on the front-end.** Polylang's
  per-language sync can leave duplicate `term_relationships` rows —
  `functions/menu.php` already dedupes defensively, but if it persists,
  delete and recreate the menu.
- **Footer settings not visible.** They're in the top-level
  **Footer** menu in the admin sidebar (icon: align-center), not under
  Appearance.
- **Sync block order button is disabled.** No translations linked — open
  the page in the other language first or use Polylang's "Add a
  translation" plus button.
