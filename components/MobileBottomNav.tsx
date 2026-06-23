"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Package, ShoppingBag, User, Heart } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useGender } from "@/context/GenderContext";
import { useStore } from "@/lib/store";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { gender } = useGender();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    const isScrolledOrNotHome = isScrolled || !isHome;

    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";
    // Always use the solid "scrolled" style because bottom nav is over the bright TrustBar on mobile.
    const activeTextClass = "text-[#1A1A1A] dark:text-[#F4F1ED]";
    const activeFillClass = "fill-[#1A1A1A]/5 dark:fill-white/10";
    const inactiveTextClass = "text-[#1A1A1A] dark:text-[#F4F1ED]/60 dark:text-[#F4F1ED]/60 hover:text-[#1A1A1A] dark:text-[#F4F1ED] dark:hover:text-[#F4F1ED]";

    const containerClass = "bg-[#F8F5EF]/85 dark:bg-[#141414]/85 backdrop-blur-[20px] saturate-[180%] dark:saturate-100 border border-[#1A1A1A]/10 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    if (pathname.includes("/product/")) {
        return null;
    }

    // Navigation Items (Home, Cart, Wishlist, Orders)
    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: Home,
            isActive: pathname === "/",
        },
        {
            name: "Cart",
            onClick: openCart,
            icon: ShoppingBag,
            isActive: false,
            badgeCount: cartCount,
        },
        {
            name: "Wishlist",
            onClick: openWishlist,
            icon: Heart,
            isActive: false,
            badgeCount: wishlistCount,
        },
        {
            name: "Orders",
            href: "/orders",
            icon: Package,
            isActive: pathname === "/orders",
        },
    ];

    // Floating pill styling - Made concise and lower to perfectly match top navbar
    return (
        <div className={`fixed bottom-1 left-2 right-2 h-[50px] transition-colors duration-500 z-50 flex items-center justify-between px-4 rounded-full shadow-md border ${containerClass}`}>

            {navItems.map((item) => {
                const textStyle = item.isActive ? activeTextClass : inactiveTextClass;
                const fillStyle = item.isActive ? activeFillClass : "";

                const iconContent = (
                    <div className="relative flex items-center justify-center p-0.5">
                        <item.icon
                            strokeWidth={2}
                            className={`w-[22px] h-[22px] transition-all duration-300 ${textStyle} ${fillStyle}`}
                        />
                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                            <span 
                                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse border border-white"
                                style={{ backgroundColor: accentColor }}
                            />
                        )}
                    </div>
                );

                const labelContent = (
                    <span
                        className={`text-[9px] uppercase tracking-[0.1em] font-extrabold transition-all duration-300 ${
                            item.isActive ? activeTextClass : inactiveTextClass
                        }`}
                    >
                        {item.name}
                    </span>
                );

                if (item.href) {
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-full h-full space-y-0.5"
                            title={item.name}
                        >
                            {iconContent}
                            {labelContent}
                        </Link>
                    );
                } else {
                    return (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className="flex flex-col items-center justify-center w-full h-full space-y-0.5 focus:outline-none"
                            title={item.name}
                        >
                            {iconContent}
                            {labelContent}
                        </button>
                    );
                }
            })}

            {/* Account Tab (Handling Auth) */}
            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5">
                <SignedIn>
                    <div className="relative flex items-center justify-center p-0.5">
                        <div className="scale-[0.8] origin-center flex items-center justify-center h-[22px] w-[22px]">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="relative flex items-center justify-center p-0.5 focus:outline-none">
                            <User
                                strokeWidth={2}
                                className={`w-[20px] h-[20px] transition-all duration-300 ${inactiveTextClass}`}
                            />
                        </button>
                    </SignInButton>
                </SignedOut>
                <span className={`text-[9px] uppercase tracking-[0.1em] font-extrabold transition-all duration-300 ${inactiveTextClass}`}>
                    Account
                </span>
            </div>
        </div>
    );
}
