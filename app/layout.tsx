import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import OnboardingModal from "@/components/OnboardingModal";

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
};

import { ClerkProvider } from "@clerk/nextjs";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GenderProvider } from "@/context/GenderContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <GenderProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NW4TQXSW');
              `}
            </Script>
            <Script id="meta-pixel" strategy="afterInteractive">
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
            className={`${playfair.variable} ${inter.variable} antialiased bg-[#FDFBF7] text-[#1A1A1A] font-sans relative pb-20 lg:pb-0`}
          >
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-NW4TQXSW"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
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
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </GenderProvider>
    </ClerkProvider>
  );
}

