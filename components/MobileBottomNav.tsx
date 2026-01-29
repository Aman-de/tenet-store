"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Sparkles, User } from "lucide-react";
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { isSignedIn } = useUser();

    // Navigation Items
    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: Home,
            isActive: pathname === "/",
        },
        {
            name: "Shop",
            href: "/collection/all", // Assuming this maps to "Category" or general shop
            icon: Grid,
            isActive: pathname.startsWith("/collection") && pathname !== "/collection/new-arrivals",
        },
        {
            name: "New",
            href: "/#new-arrivals", // Logic: Anchors to specific section or page
            icon: Sparkles,
            isActive: pathname === "/collection/new-arrivals" || pathname.includes("#new-arrivals"),
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
                        className={`w-6 h-6 transition-colors ${item.isActive ? "text-black fill-black/5" : "text-neutral-400"
                            }`}
                    />
                    <span
                        className={`text-[10px] uppercase tracking-widest font-bold ${item.isActive ? "text-black" : "text-neutral-400"
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
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black -mt-1">
                        Account
                    </span>
                </SignedIn>
            </div>
        </div>
    );
}
