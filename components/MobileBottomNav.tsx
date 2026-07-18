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

    // Match top bar liquid glass design: edge-to-edge and border-t
    const containerClass = isWoman
        ? "bg-[#FCF0F2]/90 dark:bg-[#160F11]/90 border-rose-100/50 dark:border-rose-950/20 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
        : "bg-[#F0F4F8]/90 dark:bg-[#0E1217]/90 border-blue-100/50 dark:border-blue-950/20 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]";

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
        <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col justify-center px-2 border-t backdrop-blur-[20px] saturate-[180%] dark:saturate-100 ${containerClass} pb-[env(safe-area-inset-bottom,0px)]`}>
            <div className="flex items-center justify-between w-full h-[52px]">
                {navItems.map((item) => {
                    const isItemActive = item.isActive;
                    const textStyle = isItemActive ? activeTextClass : inactiveTextClass;

                    const iconContent = (
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center justify-center p-1.5 rounded-lg"
                        >
                            {isItemActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute inset-0 bg-neutral-900/5 dark:bg-white/5 rounded-lg -z-10"
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}
                            <item.icon
                                strokeWidth={isItemActive ? 2.5 : 2}
                                className={`w-[20px] h-[20px] transition-colors duration-250 ${textStyle}`}
                            />
                            {item.badgeCount !== undefined && item.badgeCount > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-0 right-0 min-w-[14px] h-[14px] px-0.5 rounded-full text-[8px] font-sans font-bold flex items-center justify-center text-white border border-white dark:border-neutral-900 shadow-sm"
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
                            className="relative flex items-center justify-center p-1.5 rounded-lg"
                        >
                            <div className="scale-[0.8] origin-center flex items-center justify-center h-[20px] w-[20px]">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </motion.div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                className="relative flex items-center justify-center p-1.5 rounded-lg focus:outline-none"
                            >
                                <User
                                    strokeWidth={2}
                                    className={`w-[20px] h-[20px] transition-colors duration-250 ${inactiveTextClass}`}
                                />
                            </motion.button>
                        </SignInButton>
                    </SignedOut>
                    <span className={`text-[8px] uppercase tracking-[0.12em] font-extrabold transition-colors duration-250 ${inactiveTextClass}`}>
                        Account
                    </span>
                </div>
            </div>
        </div>
    );
}
