"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Package, ShoppingBag, Sparkles, User } from "lucide-react";
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useGender } from "@/context/GenderContext";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const activeTextClass = isWoman ? "text-[#E05275]" : "text-[#2B6496]";
    const activeFillClass = isWoman ? "fill-[#E05275]/5" : "fill-[#2B6496]/5";

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
            name: "New",
            href: "/#new-arrivals", // Logic: Anchors to specific section or page
            icon: Sparkles,
            isActive: pathname === "/collection/new-arrivals" || pathname.includes("#new-arrivals"),
        },
        {
            name: "Orders",
            href: "/orders",
            icon: Package,
            isActive: pathname === "/orders",
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 flex items-center justify-around pb-safe rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1"
                >
                    <item.icon
                        strokeWidth={1.5}
                        className={`w-6 h-6 transition-colors ${item.isActive ? `${activeTextClass} ${activeFillClass}` : "text-neutral-400"
                            }`}
                    />
                    <span
                        className={`text-[10px] uppercase tracking-widest font-bold ${item.isActive ? activeTextClass : "text-neutral-400"
                            }`}
                    >
                        {item.name}
                    </span>
                </Link>
            ))}
 
            {/* Account Tab (Handling Auth) */}
            <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
                <SignedIn>
                    <div className="scale-75 origin-bottom">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="flex flex-col items-center justify-center w-full h-full space-y-1">
                            <User
                                strokeWidth={1.5}
                                className="w-6 h-6 text-neutral-400"
                            />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                                Account
                            </span>
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <span className={`text-[10px] uppercase tracking-widest font-bold -mt-1 ${activeTextClass}`}>
                        Account
                    </span>
                </SignedIn>
            </div>
        </div>
    );
}
