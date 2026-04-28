import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Note: removed `distDir: 'dist'` (Vite-era leftover). Netlify's
  // @netlify/plugin-nextjs only auto-detects the standard `.next/` output.

  // assetPrefix is intentionally NOT set — same-origin serving on Vercel/
  // Netlify avoids CORS and lets `/wp-content/uploads/*` rewrites work.
  // Use App Router with SSR/ISR capabilities
  // Remove 'output: export' to enable server-side features
  // If you need static export only, uncomment the line below:
  // output: 'export',

  // Disable image optimization for WordPress compatibility
  images: {
    unoptimized: true,
  },

  // Asset prefix for WordPress theme integration (production only)
  // assetPrefix: process.env.NODE_ENV === 'production'
  //   ? '' // Leave empty for now, can be configured later for WP
  //   : '',

  // Experimental features
  experimental: {
    // Enable if needed for specific optimizations
  },

  // Webpack configuration (if needed)
  webpack: (config) => {
    return config
  },

  // Proxy WP media so the browser hits same-origin paths in both dev and
  // prod. The PHP normalizer strips the host from upload URLs (returning
  // `/wp-content/uploads/...`), and this rewrite forwards them to the
  // actual WordPress host transparently.
  async rewrites() {
    const wpHost = process.env.NEXT_PUBLIC_WP_HOST
    if (!wpHost) return []
    return [
      { source: '/wp-content/uploads/:path*', destination: `${wpHost}/wp-content/uploads/:path*` },
    ]
  },
}

export default withNextIntl(nextConfig)
