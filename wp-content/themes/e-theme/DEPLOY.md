# Deployment guide

## TL;DR — pointing local dev at the production WP backend

`assets/.env.local`:

```
NEXT_PUBLIC_WP_REST_URL=https://aiconiq.vesta-beauty.com.ua/wp-json/
NEXT_PUBLIC_WP_HOST=https://aiconiq.vesta-beauty.com.ua
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/pg-aiconiq/30min
```

```bash
cd wp-content/themes/e-theme/assets
npm install   # first time only
npm run dev
# open http://localhost:3000
```

The Next.js app fetches all WP data **server-side** (App Router server
components), so cross-origin CORS is not needed for the standard pages.
Media (`/wp-content/uploads/*`) is proxied through Next.js dev server in
local development — see `next.config.ts → rewrites()`.

## Production deployment to Vercel

1. **Vercel** → New Project → Import git repo (`git.travely24.com/ai/aiconiq.git`).
2. **Framework Preset**: Next.js (auto-detected).
3. **Root Directory**: `wp-content/themes/e-theme/assets` ⚠️ critical, do not leave at repo root.
4. **Build Command**: `npm run build` (default).
5. **Environment Variables**:

   ```
   NEXT_PUBLIC_WP_REST_URL=https://aiconiq.vesta-beauty.com.ua/wp-json/
   NEXT_PUBLIC_WP_HOST=https://aiconiq.vesta-beauty.com.ua
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/pg-aiconiq/30min
   NEXT_PUBLIC_TAVUS_PARTICIPANT_NAME=tavus-avatar-agent
   ```

   If/when LiveKit voice agent is wired up:

   ```
   LIVEKIT_URL=wss://...
   LIVEKIT_API_KEY=...
   LIVEKIT_API_SECRET=...
   LIVEKIT_AGENT_NAME=aiconiq-agent
   ```

6. **Deploy**.
7. **Domain**: Vercel project → Settings → Domains → add the production
   domain. Vercel issues a Let's Encrypt cert automatically.

## DNS

Two records, one for the WP backend and one for the Next.js front:

```
A      aiconiq.io           76.76.21.21          (Vercel — they show your real IP after add-domain)
A      admin.aiconiq.io     <ISPmanager IP>     (current WP host)
```

Or `CNAME aiconiq.io → cname.vercel-dns.com` if DNS provider supports CNAME on apex.

## CORS / cross-origin

`functions/cors.php` already whitelists:

- the WP host itself
- `localhost:3000`, `127.0.0.1:3000`, `localhost:3001`
- any `*.vercel.app` (preview + production deploys)
- extra hosts via `define('AICONIQ_ALLOWED_ORIGINS', 'https://example.com,...')` in `wp-config.php`

CORS isn't strictly required for the headless render (server-side
fetch), but plays it safe for any client-side calls and for tools that
hit `/wp-json` from the browser.

## Initial content on a fresh WP

Two paths:

1. **All-in-One WP Migration** — export from a working install (e.g.
   the dev `dental` site), import here. Captures DB + media + plugins +
   theme. Don't forget to install *All-in-One WP Migration File
   Extension* (free) on the target if the .wpress > 64MB.
2. **Tools → AICONIQ: Seed home page → Run seeder** — creates Home
   pages (EN+DE), Test Page (EN+DE), Footer Options, menus and
   downloads media from a local copy in `assets/public/` first, then
   from `aiconiq.io` if missing. See [SETUP.md](./SETUP.md).

After import / seed:

1. Settings → Permalinks → Save (flush rewrites).
2. Custom Fields → Licenses → re-enter ACF Pro license for the new domain.
3. Languages → Settings → Licenses → re-enter Polylang Pro license.
4. Open `/wp-json/wp/v2/pages?slug=home&_embed&lang=en` in browser to
   verify REST is live and returns body_blocks.

## Smoke checks after Vercel deploy

```
✓ /wp-admin                                        admin loads, theme active, ACF Field Groups visible
✓ /wp-json/wp/v2/pages?slug=home&_embed&lang=en    JSON with 17 body_blocks
✓ /wp-json/aiconiq/v1/menu/primary?lang=en         menu items list
✓ /wp-json/aiconiq/v1/footer?lang=en               footer payload

✓ https://front-domain/en                          home renders all 17 sections
✓ https://front-domain/de                          DE version
✓ https://front-domain/en/page/test-page           demo page renders
✓ Lang switcher EN ↔ DE                           routes between locales
✓ Sticky header appears on scroll                  links navigate inside Next.js
✓ DevTools Network — no CORS errors, all 200/304
```

## Troubleshooting

- **Theme broken in admin** → `style.css` lost its WP header (was the
  first deploy issue). Already fixed in repo; if you see this on a fresh
  hosting, pull latest.
- **Field groups not visible** → make sure `acf-json/` directory exists
  and ACF Pro can read it. Permission 755 (writable for WP).
- **Calendly shows "Page not found"** → `NEXT_PUBLIC_CALENDLY_URL` not
  set or wrong. Check Vercel env vars.
- **Upload limit error on All-in-One import** → install free
  *All-in-One WP Migration File Extension* plugin.
- **Lots of empty cells in Media Library** → broken attachments where
  files were manually deleted. The functions/cors.php sister-file in
  the bash logs shows a one-liner to clean these (we ran it on dental
  and dropped 630 broken records).
