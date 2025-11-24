import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Output to 'dist' directory to match Vite setup
  distDir: 'dist',

  // Use App Router with SSR/ISR capabilities
  // Remove 'output: export' to enable server-side features
  // If you need static export only, uncomment the line below:
  // output: 'export',

  // Disable image optimization for WordPress compatibility
  images: {
    unoptimized: true,
  },

  // Asset prefix for WordPress theme integration (production only)
  assetPrefix: process.env.NODE_ENV === 'production'
    ? '' // Leave empty for now, can be configured later for WP
    : '',

  // Experimental features
  experimental: {
    // Enable if needed for specific optimizations
  },

  // Webpack configuration (if needed)
  webpack: (config) => {
    return config
  },
}

export default withNextIntl(nextConfig)
