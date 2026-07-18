import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Try to read keyless.json for fallback keys
let fallbackPublishableKey = "pk_test_bHV4dXJ5LWRlbW8tNDkuY2xlcmsuYWNjb3VudHMuZGV2JA";
let fallbackSecretKey = "sk_test_dummy";

try {
  const keylessPath = path.join(process.cwd(), ".clerk", ".tmp", "keyless.json");
  if (fs.existsSync(keylessPath)) {
    const keylessData = JSON.parse(fs.readFileSync(keylessPath, "utf-8"));
    if (keylessData.publishableKey) {
      fallbackPublishableKey = keylessData.publishableKey;
    }
    if (keylessData.secretKey) {
      fallbackSecretKey = keylessData.secretKey;
    }
  }
} catch (e) {
  console.warn("Failed to load keyless.json fallback:", e);
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || fallbackPublishableKey,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || fallbackSecretKey,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
  turbopack: {},
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
};

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
