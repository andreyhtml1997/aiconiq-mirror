# HANDOVER: AICONIQ headless integration

Технический отчёт для разработчика и AI-помощника, который продолжит работу. Рассчитан на чтение перед первым прикосновением к коду.

## TL;DR архитектура

Headless WordPress + Next.js 16 (App Router, next-intl, Polylang Pro per-lang menus и страницы):

```
WordPress (PHP, admin + REST)              Next.js (assets/, port 3000)
─────────────────────────────              ──────────────────────────────
ACF Flexible Content body_blocks  ──────►  /wp-json/wp/v2/pages?slug=home
        │                                          │
        ▼                                          ▼
functions/rest-blocks.php (нормализаторы)   src/lib/wp.ts (REST client)
        │                                          │
        ▼                                          ▼
JSON: { type, anchor, divider_below, data }  ◄── BlockRenderer ──► 17 секций
```

PHP-шаблоны в `template-parts/` и `header.php` / `footer.php` — почти не используются. Новый шаблон `page-templates/blocks.php` — носитель ACF-данных, public-сайт рендерит Next.js.

## Ветка и последние коммиты

Работа в ветке `wppage-nextjs`. Главные коммиты последней итерации:

- `073d1fe` — основная интеграция: ACF body_blocks, REST-нормализаторы, BlockRenderer, sync-button, footer options, seeder, мобильное меню, фиксы.
- `45c8ae1` — `style.css` получил отсутствовавший WP theme header (тема считалась broken).
- `d2bebea` — footer top-nav теперь WP-driven; сидер local-first; `npm run fetch-media` script.

## Структура темы

```
wp-content/themes/e-theme/
├── functions.php                   подключает все модули из functions/
├── functions/
│   ├── acf.php                     CPT 'article', REST hero/tags
│   ├── acf-blocks.php              ACF Flex Content "body_blocks", 17 layouts
│   │                               location: page_template == blocks.php
│   ├── acf-footer-options.php      Top-level "Footer" admin menu (EN/DE)
│   ├── rest-blocks.php             register_rest_field('page','body_blocks')
│   │                               17 case'ов нормализаторов
│   ├── menu.php                    register_nav_menus + REST endpoint
│   │                               aiconiq/v1/menu/{location} с дедупом
│   ├── sync-blocks-order.php       Метабокс + AJAX handler для sync
│   ├── admin-setup.php             Tools → AICONIQ Seed home page
│   ├── enqueues.php / cleanup.php / setup.php   стартерные _s
├── page-templates/
│   └── blocks.php                  Шаблон "Blocks (Next.js)"
│                                   единственное место где появляется body_blocks
├── setup/
│   └── seed-home.php               Идемпотентный сидер: media + pages + menus + footer
├── assets/                         Next.js 16 app
│   ├── .env.example / .env.local   NEXT_PUBLIC_WP_REST_URL, NEXT_PUBLIC_CALENDLY_URL, ...
│   ├── package.json                + scripts.fetch-media
│   ├── scripts/
│   │   └── fetch-media.mjs         Качает 4 видео в public/assets/
│   ├── public/                     34 из 38 ассетов из сидера лежат тут
│   ├── src/
│   │   ├── app/[lang]/page.tsx     Home: fetchPageBySlug('home') → BlockRenderer
│   │   ├── app/[lang]/articles/    Articles list + single (CPT article)
│   │   ├── app/[lang]/page/[slug]/ Динамические страницы
│   │   ├── components/blocks/      block-renderer.tsx — switch по layout type
│   │   ├── components/sections/    17 секций 1-в-1 с layouts
│   │   ├── components/layout/
│   │   │   ├── index.tsx           Async server component, fetch footer + primary menu
│   │   │   ├── site-header.tsx     Async wrapper
│   │   │   ├── site-header-client.tsx  Sticky header (IntersectionObserver)
│   │   │   └── footer.tsx          Принимает navItems prop
│   │   ├── components/voice-agent-modal/ — z-[100]
│   │   ├── components/voice-agent/calendly-inline.tsx — z-[100], дефолтный URL pg-aiconiq/30min
│   │   ├── lib/wp.ts               REST client (fetchMenu, fetchPageBySlug, fetchSiteFooter, ...)
│   │   ├── types/blocks.ts         TS-типы — зеркало нормализаторов
│   │   └── stores/useVoiceAgentModalStore.ts
├── SETUP.md                        Гайд для нового dev'а (как поставить, как редактировать)
├── HANDOVER.md                     ← вы здесь
├── CLIENT-REPORT.md                Бизнес-отчёт для заказчика
└── style.css                       Theme header (без него тема broken)
```

## Что добавилось в эту итерацию

### PHP

| Файл | Что внутри |
|---|---|
| `page-templates/blocks.php` | Page template "Blocks (Next.js)". Минимальный fallback-рендер, не используется на public side. |
| `functions/acf-blocks.php` | ACF Flex Content `body_blocks`, location ограничен на `blocks.php` template. 17 layouts: `hero_main`, `auto_vs_intro_video`, `auto_vs_cards`, `positioning_intro`, `positioning_bottom`, `problem_solution`, `knowledge_intro`, `knowledge_steps`, `lead_capture_top`, `lead_capture_bottom`, `solutions_overview`, `stats`, `testimonials`, `security`, `make_impact`, `competitive_advantage_hero`, `consultant_section`, плюс `text` и `divider`. Helper `aiconiq_button_subfields()` для CTA с переключателем `action`/`url`. |
| `functions/rest-blocks.php` | Нормализаторы для каждого layout. Зарегистрирован `register_rest_field('page', 'body_blocks', ...)` — только page, не article. Все локальные uploads URL обрезают `https://host` → relative path для same-origin. |
| `functions/acf-footer-options.php` | Top-level admin menu **Footer**, две Options Pages: `aiconiq-footer-en` / `aiconiq-footer-de`. ACF group + REST endpoint `/aiconiq/v1/footer?lang=en\|de`. |
| `functions/menu.php` | `register_nav_menus(['primary', 'footer'])`. REST `/aiconiq/v1/menu/{location}?lang=en\|de`. **Дедуп** по ID и сигнатуре `url\|title\|parent` — Polylang оставляет дубли в `term_relationships` после повторных правок. |
| `functions/sync-blocks-order.php` | `add_meta_box('aiconiq_sync_blocks', 'Sync block order', ...)` на post_type 'page'. Кнопка → AJAX `wp_ajax_aiconiq_sync_blocks_order`. Логика `aiconiq_sync_blocks_order_run($source_id)`: бакетит блоки перевода по `acf_fc_layout`, разворачивает в порядке source. Лишние блоки в переводе → в конец. Recursion guard через static flag. |
| `functions/admin-setup.php` | Tools page → запуск сидера. |
| `setup/seed-home.php` | Идемпотентный сидер. **`aiconiq_seed_sideload`**: existing → local `assets/public/{path}` → network. Помечает `_aiconiq_source_url` meta для дедупа. Создаёт Home (EN/DE) с template `page-templates/blocks.php`, заполняет body_blocks, footer options, меню. |
| `style.css` | Добавлен WP theme header. |

### TypeScript / Next.js

| Файл | Что внутри |
|---|---|
| `src/types/blocks.ts` | Дискриминированный union `Block` для всех 17 layouts + универсальные. Mirror-1-в-1 с PHP-нормализаторами. `ButtonData`, `WPImage`, `WPFile`, `WPLink`, `FooterData`, `MenuItem`. |
| `src/lib/wp.ts` | `fetchMenu`, `fetchPageBySlug`, `fetchArticles`, `fetchArticleBySlug`, `fetchAllPageSlugs`, `fetchSiteFooter`. Общий `wpFetchJSON` с `next: { revalidate: 3600 }` и graceful skip когда `wpBaseUrl()` относительный (build без бэкенда). |
| `src/components/blocks/block-renderer.tsx` | Switch по `block.type`. Wrapper с `id=block.anchor` и опциональным `divider_below`. |
| `src/components/sections/*` | 17 секций. Каждая: пропсы `data?: TData`, читает поля через `data?.field || t('fallback.key')`. |
| `src/components/layout/index.tsx` | Async server component. Параллельно фетчит `footerData` + `primaryItems`, отдаёт в Footer. |
| `src/components/layout/site-header.tsx` + `site-header-client.tsx` | Sticky header, появляется когда `[data-sticky-trigger="hero-nav"]` уходит из viewport (IntersectionObserver-style scroll listener). На мобайле LangSwitcher скрыт. |
| `src/components/sections/hero/index.tsx` | Бургер вынесен в корень `<section>` с `z-[60]` и `translate-y(-10px)` на sticky. Hero CTA читается из ACF (`data?.cta`). |
| `src/components/sections/hero/navigation.tsx` | Принимает опциональный `items: MenuItem[]`. Если есть — рендерит WP-driven, если нет — hardcoded fallback с `useTranslations()`. |
| `src/components/layout/footer.tsx` | Принимает `navItems: MenuItem[]`. `<Navigation items={navItems} />` — footer top-nav теперь WP-driven. |
| `src/components/sections/lead-capture-top/index.tsx` | Текст `lg:max-w-[50%]`, `lg:pt-16 lg:pb-10` (был `py-16`). Кнопка только если `data?.button?.label` непустой. |
| `src/components/sections/knowledge/index.tsx` | Без `items-center` (карточки растягиваются). Кнопка → `setShowCalendly(true)` (раньше дёргала voice agent). Использует общий `<ChatButton>`. |
| `src/components/sections/autovsteamwork/index.tsx` | Cards container `max-w-[1200px]` (было 1280) с внутренним padding — content match с video section (1136px). CTA в правой карточке из ACF. |
| `src/components/voice-agent-modal/VoiceAgentModal.tsx` | `z-20` → `z-[100]`. |
| `src/components/voice-agent/calendly-inline.tsx` | `z-50` → `z-[100]`, дефолтный URL `pg-aiconiq/30min`. |
| `assets/scripts/fetch-media.mjs` | Качает 4 видео из aiconiq.io в `public/assets/` (idempotent). Запуск: `npm run fetch-media`. |

## Конвенции, которые надо помнить

### Один источник правды для типов

Когда добавляешь новое поле в ACF layout:
1. Добавь в `functions/acf-blocks.php` (sub_fields).
2. Добавь нормализацию в `functions/rest-blocks.php` (соответствующий case).
3. Добавь в TS-тип в `src/types/blocks.ts`.
4. Используй в компоненте секции.

Если шаги 1–3 рассинхронятся — поле либо не сохранится, либо не доедет до фронта, либо TS будет ругаться. Нет автогенерации.

### CTA-кнопки

Все CTA используют helper `aiconiq_button_subfields($prefix)` (acf-blocks.php). Структура:

```ts
{
  label: string,
  mode: 'action' | 'url',
  url: WPLink | null,    // если mode='url'
}
```

В React-компоненте паттерн:

```tsx
const buttonHref = data?.button?.mode === 'url' ? data.button.url?.url : undefined;
{buttonHref ? (
  <a href={buttonHref}><ChatButton label={...} /></a>
) : (
  <ChatButton label={...} onClick={openSomething} />
)}
```

Сейчас этот паттерн в: hero, auto_vs_cards (правая карточка), problem_solution, knowledge_steps, lead_capture_top, lead_capture_bottom, solutions_overview, competitive_advantage_hero, consultant_section. Если делаешь новый блок с кнопкой — добавь поле через `aiconiq_button_subfields(...)`, чтобы редактор получил тот же UX.

### Polylang quirks

- `pll_save_post_translations(['en' => ..., 'de' => ...])` нужен сразу после `wp_insert_post` для второго языка, иначе оба будут на дефолтном языке.
- При вставке DE-страницы сначала **без** `post_name`, иначе WP даёт `home-2` (не знает ещё что это другой язык). После `pll_save_post_translations` руками апдейтим `post_name='home'` через `$wpdb->update`.
- Polylang Pro per-language menu mapping живёт в `option('polylang')['nav_menus'][stylesheet][location] = ['en' => $en_id, 'de' => $de_id]`.
- При seeding меню убирается фильтр `pll_save_nav_menu_item` (через `remove_action`), чтобы Polylang не дублировал items в другую языковую версию во время цикла.
- Несмотря на это, бывают орфаны в `term_relationships` — поэтому в `aiconiq_menu_items()` стоит дефенсивный дедуп.

### Sync block order

Метабокс работает **по типу layout**. Если на странице несколько одинаковых layout'ов (например два `text`), они парятся по порядку появления (1-й к 1-му, 2-й ко 2-му). Если в source появился новый тип, которого нет в переводе — он **не добавляется автоматически**, нужно создать вручную и нажать sync ещё раз. Если в переводе остались блоки типа, которого нет в source — они уезжают в конец списка, не теряются.

### REST normalize → upload URL

`aiconiq_public_url(string $url)` обрезает протокол+хост из локальных uploads URL (`https://host/wp-content/uploads/...` → `/wp-content/uploads/...`). Это нужно для same-origin на dev: Next.js dev proxy в `next.config.ts` пробрасывает `/wp-content/uploads/*` к WP-хосту.

## Гарантии и инварианты

- ACF body_blocks **не появляется** на статьях, обычных страницах, любых CPT — только на странице с template `page-templates/blocks.php`.
- Articles используют свои ACF-поля (`hero_content_type`, `hero_video`, `hero_slider`, `Tabs`) из `functions/acf.php`. Body blocks им недоступен через REST.
- Footer данные **только** в Options Pages, не на обычных страницах.
- Сидер **перезаписывает** контент Home, Footer Options и меню. Не запускать на проде после ручных правок.
- `_aiconiq_source_url` post meta — ключ дедупа медиа. Если очищаешь Media Library — снеси и эту мету, иначе дубль.

## Технический долг и open issues

- **Next.js 16 deprecated `middleware.ts`** — переименовать в `proxy.ts`, обновить экспорт. Сейчас warning в build/dev, но работает.
- **"Invalid segment configuration export detected"** — в одном из роутов невалидный экспорт `dynamic` / `revalidate` / `runtime`. Build всё равно exit 0, но стоит найти и починить.
- **`browserslist` outdated** — `npx update-browserslist-db@latest`.
- **`baseline-browser-mapping` outdated** — `npm i baseline-browser-mapping@latest -D`.
- **CTA в Hero и в правой карточке Auto-vs** — поля добавлены в ACF, но сидер их не заполняет. После прогона сидера надо вручную в админке.
- **Тяжёлые видео не в git** — `npm run fetch-media` качает их из aiconiq.io. Если решите класть в git — поднять Git LFS.
- **Voice agent модалка** — z-index подняли, но логика модалки сама по себе сложная (LiveKit + Tavus). При проблемах смотреть `src/components/voice-agent-modal/VoiceAgentContent.tsx`.

## Команды

```bash
# Первичная установка front-end
cd wp-content/themes/e-theme/assets
cp .env.example .env.local
# отредактировать NEXT_PUBLIC_WP_REST_URL и NEXT_PUBLIC_CALENDLY_URL
npm install
npm run fetch-media   # один раз, ~30–100 МБ
npm run build         # production build
npm run dev           # dev на :3000

# Сидер контента WP — Tools → AICONIQ: Seed home page → Run seeder
# (после установки темы и активации ACF Pro + Polylang Pro + 2 языков)

# Sync порядка блоков — на странице редактора, правый сайдбар "Sync block order"

# PHP lint
"$PHP" -l wp-content/themes/e-theme/functions/acf-blocks.php

# TS check
cd wp-content/themes/e-theme/assets && npx tsc --noEmit
```
