/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: {
    // ESLint runs separately in CI; don't block build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors show in editor; don't block static export build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
