"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Package, ShoppingBag, User, Heart } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useGender } from "@/context/GenderContext";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { gender } = useGender();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";
    
    const activeTextClass = "text-[#1A1A1A] dark:text-[#F4F1ED]";
    const inactiveTextClass = "text-neutral-500 dark:text-neutral-400 hover:text-[#1A1A1A] dark:hover:text-[#F4F1ED]";

    // Beautiful gender-specific background color with glassmorphism
    const containerClass = isWoman
        ? "bg-[#FCF0F2]/90 dark:bg-[#160F11]/90 backdrop-blur-xl border border-rose-100/50 dark:border-rose-950/20 shadow-[0_12px_40px_rgba(252,240,242,0.4)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        : "bg-[#F0F4F8]/90 dark:bg-[#0E1217]/90 backdrop-blur-xl border border-blue-100/50 dark:border-blue-950/20 shadow-[0_12px_40px_rgba(240,244,248,0.4)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]";

    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    if (pathname.includes("/product/")) {
        return null;
    }

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

    return (
        <div className={`fixed bottom-[18px] left-4 right-4 h-[62px] transition-all duration-300 z-50 flex items-center justify-between px-3 rounded-2xl shadow-xl ${containerClass}`}>
            {navItems.map((item) => {
                const isItemActive = item.isActive;
                const textStyle = isItemActive ? activeTextClass : inactiveTextClass;

                const iconContent = (
                    <motion.div 
                        whileTap={{ scale: 0.9 }}
                        className="relative flex items-center justify-center p-2 rounded-xl"
                    >
                        {isItemActive && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute inset-0 bg-neutral-900/5 dark:bg-white/5 rounded-xl -z-10"
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            />
                        )}
                        <item.icon
                            strokeWidth={isItemActive ? 2.5 : 2}
                            className={`w-[22px] h-[22px] transition-colors duration-250 ${textStyle}`}
                        />
                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full text-[8px] font-sans font-bold flex items-center justify-center text-white border border-white dark:border-neutral-900 shadow-sm"
                                style={{ backgroundColor: accentColor }}
                            >
                                {item.badgeCount}
                            </motion.span>
                        )}
                    </motion.div>
                );

                const labelContent = (
                    <span
                        className={`text-[8px] uppercase tracking-[0.12em] font-extrabold transition-colors duration-250 ${textStyle}`}
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
                    <motion.div 
                        whileTap={{ scale: 0.9 }}
                        className="relative flex items-center justify-center p-2 rounded-xl"
                    >
                        <div className="scale-[0.85] origin-center flex items-center justify-center h-[22px] w-[22px]">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </motion.div>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center justify-center p-2 rounded-xl focus:outline-none"
                        >
                            <User
                                strokeWidth={2}
                                className={`w-[22px] h-[22px] transition-colors duration-250 ${inactiveTextClass}`}
                            />
                        </motion.button>
                    </SignInButton>
                </SignedOut>
                <span className={`text-[8px] uppercase tracking-[0.12em] font-extrabold transition-colors duration-250 ${inactiveTextClass}`}>
                    Account
                </span>
            </div>
        </div>
    );
}
