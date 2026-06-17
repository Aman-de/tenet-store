"use client";

import { ShoppingBag, Menu, X, Heart, User, Package, Crown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";

import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/lib/store";
import { useGender } from "@/context/GenderContext";

export default function Navbar() {
    const pathname = usePathname();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    const { gender, setGender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = isWoman ? "#FF4D6D" : "#3B82F6";
    const [mounted, setMounted] = useState(false);
    const { isSignedIn } = useUser();

    useEffect(() => {
        useStore.persist.rehydrate();
        setMounted(true);
    }, []);

    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    
    // Dynamically apply glassmorphism based on scroll/page state
    const isScrolledOrNotHome = isScrolled || !isHome;
    
    // Authentic Apple Liquid Glass effect
    const navContainerClass = isScrolledOrNotHome 
        ? "bg-[#F8F5EF]/85 dark:bg-[#141414]/85 backdrop-blur-[20px] saturate-[180%] dark:saturate-100 border-b lg:border border-[#1A1A1A]/10 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.03)]" 
        : "bg-transparent border-b border-transparent shadow-none lg:bg-[#F8F5EF]/85 lg:dark:bg-[#141414]/85 lg:backdrop-blur-[20px] lg:saturate-[180%] dark:saturate-100 lg:border lg:border-[#1A1A1A]/10 lg:dark:border-white/10 lg:shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

    const textColor = isScrolledOrNotHome ? "text-neutral-800 dark:text-[#F4F1ED]" : "text-white lg:text-neutral-800 lg:dark:text-[#F4F1ED]";
    const logoColor = isScrolledOrNotHome ? "text-black dark:text-white" : "text-white lg:text-black lg:dark:text-white";
    const iconStroke = 2;
    const iconGlassBg = isScrolledOrNotHome ? "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20" : "bg-white/10 hover:bg-white/20 lg:bg-black/5 lg:dark:bg-white/10 lg:hover:bg-black/10 lg:dark:hover:bg-white/20";

    // Ultra-premium Apple-style segmented control (Liquid Glass)
    const GenderToggle = ({ idSuffix, isDesktop = false }: { idSuffix: string, isDesktop?: boolean }) => {
        const solid = isScrolledOrNotHome || isDesktop;
        const toggleBg = solid ? "bg-[#1A1A1A]/5 dark:bg-white/10" : "bg-white/10";
        const btnText = (active: boolean) => {
            if (active) return "text-white dark:text-[#1A1A1A] dark:text-[#F4F1ED]";
            return solid ? "text-[#1A1A1A] dark:text-[#F4F1ED] font-medium" : "text-white/80 font-medium";
        };
        return (
            <div className={`relative flex items-center rounded-full p-1 transition-colors duration-500 backdrop-blur-md ${toggleBg}`}>
                <button 
                    onClick={() => setGender('man')}
                    className={`relative z-10 w-16 sm:w-20 py-1.5 text-[10px] sm:text-xs tracking-widest uppercase transition-colors duration-300 ${btnText(gender === 'man')}`}
                >
                    MEN
                    {gender === 'man' && (
                        <motion.div
                            layoutId={`nav-gender-active-${idSuffix}`}
                            className="absolute inset-0 rounded-full -z-10 shadow-sm"
                            style={{ backgroundColor: accentColor }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
                <button 
                    onClick={() => setGender('woman')}
                    className={`relative w-16 sm:w-20 py-1.5 text-[10px] sm:text-xs tracking-widest uppercase transition-colors z-10 ${btnText(gender === 'woman')}`}
                >
                    WOMEN
                    {gender === 'woman' && (
                        <motion.div
                            layoutId={`nav-gender-active-${idSuffix}`}
                            className="absolute inset-0 rounded-full -z-10 shadow-sm"
                            style={{ backgroundColor: accentColor }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
            </div>
        );
    };

    const isProductPage = pathname.includes("/product/");

    return (
        <>
            {/* The wrapper handles the floating position */}
            <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out pointer-events-none lg:pt-5 lg:pb-2 lg:px-6`}>
                <nav className={`pointer-events-auto w-full mx-auto px-4 lg:px-8 py-2 lg:py-2.5 transition-all duration-500 ease-in-out lg:rounded-full lg:max-w-[800px] xl:max-w-[900px] ${navContainerClass}`}>
                    
                    {/* MOBILE LAYOUT (lg:hidden) */}
                    <div className="flex lg:hidden w-full items-center justify-between relative">
                        {isProductPage ? (
                            <>
                                {/* LEFT SIDE: Account, Orders, Collection */}
                                <div className="flex items-center gap-1 z-10 flex-1 justify-start">
                                    {isSignedIn ? (
                                        <div className={`w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`}>
                                            <div className="scale-[0.75] origin-center flex items-center justify-center">
                                                <UserButton afterSignOutUrl="/" />
                                            </div>
                                        </div>
                                    ) : (
                                        <SignInButton mode="modal">
                                            <button className={`w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Sign in">
                                                <User className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                            </button>
                                        </SignInButton>
                                    )}
                                    <Link href="/orders" className={`w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Orders">
                                        <Package className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                    </Link>
                                    <Link href="/#new-arrivals" className={`w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Collections">
                                        <LayoutGrid className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                    </Link>
                                </div>

                                {/* CENTER: Logo (Absolute Centered) */}
                                <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10">
                                    <span className={`text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] uppercase group-hover:opacity-80 transition-colors duration-500 ${logoColor} drop-shadow-sm`}>
                                        TENET
                                    </span>
                                </Link>

                                {/* RIGHT SIDE: Circle, Wishlist, Cart */}
                                <div className="flex items-center gap-1 z-10 flex-1 justify-end">
                                    <Link href="/circle" className={`w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="The Circle">
                                        <Crown className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                    </Link>
                                    <button className={`relative w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Open wishlist" onClick={openWishlist}>
                                        <Heart className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        {wishlistCount > 0 && (
                                            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                    <button className={`relative w-[32px] h-[32px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Open cart" onClick={openCart}>
                                        <ShoppingBag className={`w-[18px] h-[18px] transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        {cartCount > 0 && (
                                            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* LEFT: Gender Toggle */}
                                <div className="flex items-center justify-start flex-1 z-10">
                                    <div className="scale-[0.85] sm:scale-100 origin-left">
                                        <GenderToggle idSuffix="mobile" />
                                    </div>
                                </div>

                                {/* CENTER: Logo (Absolute Centered) */}
                                <Link href="/" className="absolute left-[54%] sm:left-1/2 -translate-x-1/2 z-10">
                                    <span className={`text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] uppercase group-hover:opacity-80 transition-colors duration-500 ${logoColor} drop-shadow-sm`}>
                                        TENET
                                    </span>
                                </Link>

                                {/* RIGHT: Icons */}
                                <div className="flex items-center justify-end flex-1 gap-1 sm:gap-2 z-10">
                                    <button className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center relative`} aria-label="Open wishlist" onClick={openWishlist}>
                                        <Heart className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        {wishlistCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                    <button className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                        {isMobileMenuOpen ? (
                                            <X className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        ) : (
                                            <Menu className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* DESKTOP LAYOUT (hidden lg:flex) */}
                    <div className="hidden lg:flex items-center justify-between gap-8 lg:gap-10 px-2">
                        
                        {/* LEFT SIDE: Account, Circle, Gender Toggle */}
                        <div className={`flex items-center gap-5 lg:gap-6 transition-colors duration-500 ${textColor} flex-1 justify-end`}>
                            {/* Account */}
                            <div className="flex flex-col items-center gap-1 group">
                                {isSignedIn ? (
                                    <div className="w-5 h-5 flex items-center justify-center scale-[0.8] origin-center opacity-90 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                ) : (
                                    <SignInButton mode="modal">
                                        <button aria-label="Sign in" className="flex items-center justify-center">
                                            <User className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                        </button>
                                    </SignInButton>
                                )}
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Account</span>
                            </div>

                            {/* Circle */}
                            <Link href="/circle" className="flex flex-col items-center gap-1 group">
                                <Crown className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Circle</span>
                            </Link>

                            {/* Subtle Divider */}
                            <div className="w-[1px] h-6 bg-black/10 mx-1" />

                            {/* Gender Toggle */}
                            <div className="flex-shrink-0 origin-center">
                                <GenderToggle idSuffix="desktop" isDesktop={true} />
                            </div>
                        </div>

                        {/* CENTER: Logo */}
                        <Link href="/" className="block group shrink-0 mx-2">
                            <span className={`text-3xl font-serif font-bold tracking-[0.25em] uppercase group-hover:opacity-80 transition-opacity duration-300 ${logoColor} drop-shadow-lg`}>
                                TENET
                            </span>
                        </Link>

                        {/* RIGHT SIDE: Shop, Orders, Saves, Cart */}
                        <div className={`flex items-center gap-5 lg:gap-6 transition-colors duration-500 ${textColor} flex-1 justify-start`}>
                            {/* Shop / Collections */}
                            <Link href="/#new-arrivals" className="flex flex-col items-center gap-1 group">
                                <LayoutGrid className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Shop</span>
                            </Link>

                            {/* Orders */}
                            <Link href="/orders" className="flex flex-col items-center gap-1 group">
                                <Package className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Orders</span>
                            </Link>

                            {/* Wishlist */}
                            <button className="flex flex-col items-center gap-1 group" aria-label="Open wishlist" onClick={openWishlist}>
                                <div className="relative flex items-center justify-center">
                                    <Heart className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }} />
                                    )}
                                </div>
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Saves</span>
                            </button>

                            {/* Cart */}
                            <button className="flex flex-col items-center gap-1 group" aria-label="Open cart" onClick={openCart}>
                                <div className="relative flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }} />
                                    )}
                                </div>
                                <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">Cart</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-4 right-4 mt-2 pointer-events-auto bg-white/90 backdrop-blur-3xl saturate-200 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[32px] overflow-hidden py-4"
                        >
                            <div className="flex flex-col">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/#new-arrivals"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    ORDERS
                                </Link>
                                <SignedIn>
                                    <div className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-4 border-b border-neutral-100">
                                        <span>ACCOUNT</span>
                                        <div className="scale-90 origin-center">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </div>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100 w-full"
                                        >
                                            ACCOUNT (LOG IN)
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <div className="flex justify-center gap-8 py-6">
                                    <button className="relative p-2" aria-label="Open wishlist" onClick={() => { setIsMobileMenuOpen(false); openWishlist(); }}>
                                        <Heart className="w-6 h-6 text-[#1A1A1A] dark:text-[#F4F1ED]" strokeWidth={iconStroke} />
                                        {wishlistCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                    <button className="relative p-2" aria-label="Open cart" onClick={() => { setIsMobileMenuOpen(false); openCart(); }}>
                                        <ShoppingBag className="w-6 h-6 text-[#1A1A1A] dark:text-[#F4F1ED]" strokeWidth={iconStroke} />
                                        {cartCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
