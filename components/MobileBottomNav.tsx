"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Package, ShoppingBag, User, Crown } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useGender } from "@/context/GenderContext";
import { useStore } from "@/lib/store";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { gender } = useGender();
    const { openCart, cart } = useStore();
    
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
    const accentColor = isWoman ? "#E05275" : "#2B6496";
    // High contrast active/inactive states
    const activeTextClass = isWoman ? "text-[#E05275]" : "text-[#2B6496]";
    const activeFillClass = isWoman ? "fill-[#E05275]/10" : "fill-[#2B6496]/10";
    const inactiveTextClass = isScrolledOrNotHome ? "text-neutral-500 hover:text-neutral-700" : "text-white/80 hover:text-white";

    const containerClass = isScrolledOrNotHome
        ? "bg-white/90 backdrop-blur-2xl border-white/50"
        : "bg-black/20 backdrop-blur-md border-white/10";

    const cartCount = mounted ? cart.length : 0;

    if (pathname.includes("/product/")) {
        return null;
    }

    // Navigation Items (Home, Cart, Circle, Orders)
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
            hasBadge: true,
        },
        {
            name: "Circle",
            href: "/circle",
            icon: Crown,
            isActive: pathname === "/circle",
        },
        {
            name: "Orders",
            href: "/orders",
            icon: Package,
            isActive: pathname === "/orders",
        },
    ];

    const attentionStyles = {
        "--attention-color": accentColor,
        "--attention-color-glow": `${accentColor}60`
    } as React.CSSProperties;

    // Floating pill styling
    return (
        <div className={`fixed bottom-4 left-4 right-4 h-[68px] transition-colors duration-500 z-50 flex items-center justify-around pb-0 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border ${containerClass}`}>
            <style>{`
                @keyframes accountAttention {
                    0%, 20%, 100% {
                        color: #a3a3a3;
                        transform: scale(1);
                    }
                    10% {
                        color: var(--attention-color);
                        transform: scale(1.08);
                    }
                }
                .animate-attention {
                    animation: accountAttention 10s infinite ease-in-out;
                }
            `}</style>

            {navItems.map((item) => {
                const textStyle = item.isActive ? activeTextClass : inactiveTextClass;
                const fillStyle = item.isActive ? activeFillClass : "";

                const iconContent = (
                    <div className="relative flex items-center justify-center p-0.5">
                        <item.icon
                            strokeWidth={2}
                            className={`w-[22px] h-[22px] transition-all duration-300 ${textStyle} ${fillStyle}`}
                        />
                        {item.hasBadge && cartCount > 0 && (
                            <span 
                                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse border border-white"
                                style={{ backgroundColor: accentColor }}
                            />
                        )}
                    </div>
                );

                const labelContent = (
                    <span
                        className={`text-[9px] uppercase tracking-[0.1em] font-bold transition-all duration-300 ${
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
                    <div className="scale-75 origin-bottom">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button 
                            className="flex flex-col items-center justify-center w-full h-full animate-attention focus:outline-none"
                            style={attentionStyles}
                            title="Account"
                        >
                            <User
                                strokeWidth={2}
                                className={`w-[22px] h-[22px] transition-colors ${inactiveTextClass}`}
                            />
                        </button>
                    </SignInButton>
                </SignedOut>
                <span className={`text-[9px] uppercase tracking-[0.1em] font-bold ${inactiveTextClass}`}>
                    Account
                </span>
            </div>
        </div>
    );
}
