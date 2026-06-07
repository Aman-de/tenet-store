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
    useEffect(() => {
        setMounted(true);
    }, []);

    const isWoman = gender === "woman";
    const accentColor = isWoman ? "#E05275" : "#2B6496";
    const activeTextClass = isWoman ? "text-[#E05275]" : "text-[#2B6496]";
    const activeFillClass = isWoman ? "fill-[#E05275]/5" : "fill-[#2B6496]/5";

    const cartCount = mounted ? cart.length : 0;

    if (pathname.includes("/product/")) {
        return null;
    }

    // Navigation Items (Home, Cart, Ambassador, Orders)
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
            name: "Ambassador",
            href: "/circle",
            icon: Crown,
            isActive: pathname === "/circle",
            isGoldCircle: true,
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

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 flex items-center justify-around pb-safe rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
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
                // Style Ambassador tab active state as gold (#D4AF37)
                const currentActiveText = item.isGoldCircle ? "text-[#D4AF37]" : activeTextClass;
                const currentActiveFill = item.isGoldCircle ? "fill-[#D4AF37]/5" : activeFillClass;
                const textStyle = item.isActive ? currentActiveText : "text-neutral-400";
                const fillStyle = item.isActive ? currentActiveFill : "";

                const iconContent = (
                    <div className="relative flex items-center justify-center p-0.5">
                        <item.icon
                            strokeWidth={1.5}
                            className={`w-[21px] h-[21px] transition-all duration-300 ${textStyle} ${fillStyle}`}
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
                        className={`text-[8px] uppercase tracking-wider font-bold transition-all duration-300 ${
                            item.isActive ? currentActiveText : "text-neutral-400"
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
                                strokeWidth={1.5}
                                className="w-[21px] h-[21px] transition-colors"
                            />
                        </button>
                    </SignInButton>
                </SignedOut>
                <span className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">
                    Account
                </span>
            </div>
        </div>
    );
}
