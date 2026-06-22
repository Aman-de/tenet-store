import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('@/components/CartDrawer'));
const WishlistDrawer = dynamic(() => import('@/components/WishlistDrawer'));
const OnboardingModal = dynamic(() => import('@/components/OnboardingModal'));
const WhatsAppWidget = dynamic(() => import('@/components/WhatsAppWidget'));
const InstallPWA = dynamic(() => import('@/components/InstallPWA'));

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TENET | Silent Luxury",
  description: "Premium, Old Money aesthetic e-commerce store for men.",
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TENET",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F5EF",
};

import { ClerkProvider } from "@clerk/nextjs";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GenderProvider } from "@/context/GenderContext";
import GenderThemeWrapper from "@/components/GenderThemeWrapper";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { getSettings } from "@/lib/sanity";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <ClerkProvider>
      <PostHogProvider>
        <GenderProvider>
          <html lang="en" suppressHydrationWarning>
          <head>
            <script id="theme-initializer" dangerouslySetInnerHTML={{ __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `}} />
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-18224844065" />
            <Script id="google-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-18224844065');
              `}
            </Script>
            <Script id="meta-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                 n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '976090785135183');
                fbq('track', 'PageView');
              `}
            </Script>
          </head>
          <body
            className={`${playfair.variable} ${inter.variable} antialiased text-[#1A1A1A] dark:text-[#F4F1ED] dark:selection:bg-white dark:selection:text-black font-sans relative pb-20 lg:pb-0`}
          >
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=976090785135183&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
            {/* Global Film Grain / Noise Overlay */}
            <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            <GenderThemeWrapper settings={settings}>
              <Navbar />
              {children}
              <div className="lg:hidden">
                <MobileBottomNav />
              </div>
              <Suspense fallback={null}>
                <CartDrawer />
              </Suspense>
              <WishlistDrawer />
              <OnboardingModal />
              <InstallPWA />
              <SpeedInsights />
              <Analytics />
            </GenderThemeWrapper>
          </body>
          </html>
        </GenderProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}

