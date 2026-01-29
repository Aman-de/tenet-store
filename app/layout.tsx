import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";

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

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`${playfair.variable} ${inter.variable} antialiased bg-[#FDFBF7] text-[#1A1A1A] font-sans relative pb-20 md:pb-0`}
        >
          {/* Global Film Grain / Noise Overlay */}
          <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

          {children}
          <div className="md:hidden">
            <MobileBottomNav />
          </div>
          <CartDrawer />
          <WishlistDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
