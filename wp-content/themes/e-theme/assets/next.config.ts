import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Output to 'dist' directory to match Vite setup
  distDir: 'dist',

  // assetPrefix: 'https://anni.bestfewo.de' ,
  // Only use prod CDN prefix in production builds — local dev needs assets from localhost.
  ...(process.env.NODE_ENV === 'production' ? { assetPrefix: 'https://aiconiq.io' } : {}),
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

  // Dev-only proxy for WP media so the browser sees same-origin URLs.
  // Production should serve uploads from the same host as the frontend.
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return []
    const wpHost = process.env.NEXT_PUBLIC_WP_HOST || 'http://dental'
    return [
      { source: '/wp-content/uploads/:path*', destination: `${wpHost}/wp-content/uploads/:path*` },
    ]
  },
}

export default withNextIntl(nextConfig)
