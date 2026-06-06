"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Package, ShoppingBag, User } from "lucide-react";
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

    // Navigation Items
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
                        filter: drop-shadow(0 0 0px transparent);
                    }
                    10% {
                        color: var(--attention-color);
                        transform: scale(1.06);
                        filter: drop-shadow(0 0 4px var(--attention-color-glow));
                    }
                }
                .animate-attention {
                    animation: accountAttention 10s infinite ease-in-out;
                }
            `}</style>

            {navItems.map((item) => {
                const iconContent = (
                    <div className="relative">
                        <item.icon
                            strokeWidth={1.5}
                            className={`w-6 h-6 transition-colors ${item.isActive ? `${activeTextClass} ${activeFillClass}` : "text-neutral-400"
                                }`}
                        />
                        {item.hasBadge && cartCount > 0 && (
                            <span 
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse border border-white"
                                style={{ backgroundColor: accentColor }}
                            />
                        )}
                    </div>
                );

                const labelContent = (
                    <span
                        className={`text-[10px] uppercase tracking-widest font-bold ${item.isActive ? activeTextClass : "text-neutral-400"
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
                            className="flex flex-col items-center justify-center w-full h-full space-y-1"
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
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none"
                        >
                            {iconContent}
                            {labelContent}
                        </button>
                    );
                }
            })}

            {/* Account Tab (Handling Auth) */}
            <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
                <SignedIn>
                    <div className="scale-75 origin-bottom">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button 
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 animate-attention focus:outline-none"
                            style={attentionStyles}
                        >
                            <User
                                strokeWidth={1.5}
                                className="w-6 h-6 transition-colors"
                            />
                            <span className="text-[10px] uppercase tracking-widest font-bold transition-colors">
                                Account
                            </span>
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <span className="text-[10px] uppercase tracking-widest font-bold -mt-1 text-neutral-400">
                        Account
                    </span>
                </SignedIn>
            </div>
        </div>
    );
}
