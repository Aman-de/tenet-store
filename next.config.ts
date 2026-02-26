import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This removes the "quality" warning
    unoptimized: true,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 4. Configure allowed image qualities to suppress warnings
    // Default is 75, we explicitly allow 100 for high-fidelity hero images
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compiler: {
    styledComponents: true,
  },
  // Suppress the React 19 / Next.js 15 disableTransition warning in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;// Force restart
