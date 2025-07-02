/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // In Next.js 15.2.4, use serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@prisma/client'],
  // Remove transpilePackages as it conflicts with serverExternalPackages
  // webpack configuration is not needed as we're using serverExternalPackages
}

export default nextConfig
