/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './local-build', // Store build output in a local directory instead of .next
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    // Enable build cache
    turboCacheMode: 'local',
    // Optimize images
    optimizePackageImports: ['@/components/ui'],
    // Disable source maps in production
    sourceMaps: process.env.NODE_ENV !== 'production',
  },
  // Minimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Image optimization
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    formats: ['image/avif', 'image/webp'],
  },
  // Other existing config
}

module.exports = nextConfig 