"use client";

import { ShoppingBag, Menu, X, Heart, User, Package, Crown, LayoutGrid, Search, Home, Moon, Sun, Monitor, Mic, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/lib/store";
import { useGender } from "@/context/GenderContext";

export default function Navbar() {
    const pathname = usePathname();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    const { gender, setGender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const SearchBar = () => {
        const placeholderText = gender === 'woman' 
            ? "Search kurtis, co-ords, sets..." 
            : "Search shirts, trousers, knitwear...";
            
        return (
            <form onSubmit={handleSearchSubmit} className="w-full px-1 pt-1.5 pb-2 pointer-events-auto">
                <div className="relative flex items-center bg-[#F4F1ED]/80 dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 rounded-full px-4 h-[40px] transition-all focus-within:border-black/25 dark:focus-within:border-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" strokeWidth={2.5} />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={placeholderText}
                        className="w-full bg-transparent border-none outline-none pl-2.5 pr-12 text-[12px] font-sans placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-800 dark:text-[#F4F1ED]"
                    />
                    <div className="absolute right-4 flex items-center gap-2.5">
                        <button type="button" aria-label="Voice search" className="hover:scale-105 active:scale-95 transition-transform" onClick={() => alert("Voice search is not configured.")}>
                            <Mic className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" strokeWidth={2.5} />
                        </button>
                        <button type="button" aria-label="Camera search" className="hover:scale-105 active:scale-95 transition-transform" onClick={() => alert("Image search is not configured.")}>
                            <Camera className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </form>
        );
    };
    const { isSignedIn } = useUser();

    useEffect(() => {
        useStore.persist.rehydrate();
        setMounted(true);
    }, []);

    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // Initialize state on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('system');
        }
    }, []);

    // Sync theme adjustments with document classes
    useEffect(() => {
        const root = document.documentElement;
        
        const applyTheme = () => {
            if (theme === 'system') {
                const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (systemIsDark) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            } else if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme();

        // Listen to OS scheme changes if system is selected
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            if (theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    const isProductPage = pathname.includes("/product/");
    const isCategoryPage = pathname.includes("/collection/") || pathname.includes("/category/");
    const showSearchAndSwitchOnTop = isHome || isCategoryPage;
    
    // Dynamically apply glassmorphism based on scroll/page state
    const isScrolledOrNotHome = isScrolled || !isHome;
    
    // Authentic Apple Liquid Glass effect
    // Only show borders on product page as requested by user
    const navbarBg = isWoman 
        ? "bg-[#FCF0F2]/90 dark:bg-[#160F11]/90" 
        : "bg-[#F0F4F8]/90 dark:bg-[#0E1217]/90";

    const navContainerClass = isScrolledOrNotHome 
        ? `${navbarBg} backdrop-blur-[20px] saturate-[180%] dark:saturate-100 ${isProductPage ? 'border-b lg:border border-[#1A1A1A]/10 dark:border-white/10' : 'border-b border-neutral-100 dark:border-neutral-800 lg:border-none'} shadow-[0_2px_10px_rgba(0,0,0,0.03)]` 
        : `${navbarBg} backdrop-blur-[20px] lg:bg-transparent lg:border-transparent lg:shadow-none lg:backdrop-blur-none lg:saturate-100 lg:dark:saturate-100 ${isProductPage ? 'lg:border lg:border-[#1A1A1A]/10 lg:dark:border-white/10' : 'lg:border-none border-b border-neutral-100 dark:border-neutral-800'} lg:shadow-none`;

    const textColor = isScrolledOrNotHome 
        ? "text-neutral-800 dark:text-[#F4F1ED]" 
        : "text-[#1A1A1A] dark:text-[#F4F1ED] lg:text-white lg:dark:text-[#F4F1ED]";
    const logoColor = isScrolledOrNotHome 
        ? "text-black dark:text-white" 
        : "text-black dark:text-white lg:text-white lg:dark:text-white";
    const iconStroke = 2;
    const iconGlassBg = isScrolledOrNotHome 
        ? "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20" 
        : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 lg:bg-white/10 lg:hover:bg-white/20 lg:dark:bg-white/10 lg:dark:hover:bg-white/20";

    // Ultra-premium Apple-style segmented control (Liquid Glass)
    const GenderToggle = ({ idSuffix, isDesktop = false, isMini = false }: { idSuffix: string, isDesktop?: boolean, isMini?: boolean }) => {
        const solid = isScrolledOrNotHome || isDesktop || idSuffix === "mobile-bar" || idSuffix === "mobile-top-bar";
        const toggleBg = solid ? "bg-[#1A1A1A]/5 dark:bg-white/10" : "bg-white/10";
        const btnText = (active: boolean) => {
            if (active) return "text-white dark:text-[#1A1A1A] dark:text-[#F4F1ED]";
            return solid ? "text-[#1A1A1A] dark:text-[#F4F1ED] font-medium" : "text-white/80 font-medium";
        };
        const manWidth = isMini ? "w-10" : "w-14 sm:w-20";
        const womanWidth = isMini ? "w-12" : "w-16 sm:w-20";
        const paddingY = isMini ? "py-1" : "py-1.5 sm:py-2";
        const textSize = isMini ? "text-[8px]" : "text-[10px] sm:text-xs";
        
        return (
            <div className={`relative flex items-center rounded-full transition-colors duration-500 backdrop-blur-md ${toggleBg} ${isMini ? 'p-0.5' : 'p-1 sm:p-1'}`}>
                <button 
                    onClick={() => setGender('man')}
                    className={`relative z-10 tracking-widest uppercase transition-colors duration-300 ${manWidth} ${paddingY} ${textSize} ${btnText(gender === 'man')}`}
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
                    className={`relative tracking-widest uppercase transition-colors z-10 ${womanWidth} ${paddingY} ${textSize} ${btnText(gender === 'woman')}`}
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

    const ThemeToggle = ({ isDesktop = false }: { isDesktop?: boolean }) => {
        if (!mounted) return <div className={isDesktop ? "w-8 h-8" : "w-[120px] h-[32px]"} />;
        
        if (isDesktop) {
            const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
            const currentIndex = themes.indexOf(theme);
            const nextTheme = themes[(currentIndex + 1) % 3];
            
            return (
                <button
                    onClick={() => {
                        setTheme(nextTheme);
                        localStorage.setItem('theme', nextTheme);
                    }}
                    className="flex flex-col items-center gap-1 group w-10"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' && <Sun className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />}
                    {theme === 'system' && <Monitor className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />}
                    {theme === 'dark' && <Moon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={2} />}
                    <span className="text-[11px] font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                        {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Auto'}
                    </span>
                </button>
            );
        }

        return (
            <div className="flex items-center bg-neutral-100 dark:bg-[#1A1A1A] rounded p-0.5 border border-black/5 dark:border-white/5 shadow-inner">
                {(['light', 'system', 'dark'] as const).map((t) => {
                    const isActive = theme === t;
                    return (
                        <button
                            key={t}
                            onClick={() => {
                                setTheme(t);
                                localStorage.setItem('theme', t);
                            }}
                            className={cn(
                                "flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded transition-all duration-300 cursor-pointer",
                                isActive
                                    ? "text-[#1A1A1A] dark:text-[#F4F1ED] font-black opacity-100 bg-white dark:bg-neutral-800 shadow-sm"
                                    : "text-[#1A1A1A]/40 dark:text-[#F4F1ED]/30 font-normal hover:opacity-80"
                            )}
                        >
                            {t === 'light' && <Sun className={cn("w-3.5 h-3.5", isActive ? "stroke-[2.5]" : "stroke-[1.25]")} />}
                            {t === 'system' && <Monitor className={cn("w-3.5 h-3.5", isActive ? "stroke-[2.5]" : "stroke-[1.25]")} />}
                            {t === 'dark' && <Moon className={cn("w-3.5 h-3.5", isActive ? "stroke-[2.5]" : "stroke-[1.25]")} />}
                            <span className={cn("text-[9px] tracking-wider uppercase", isActive ? "font-extrabold" : "font-normal")}>
                                {t === 'system' ? 'Auto' : t}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* The wrapper handles the floating position */}
            <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out pointer-events-none lg:pt-5 lg:pb-2 lg:px-6`}>
                <nav className={`pointer-events-auto w-full mx-auto px-4 lg:px-8 py-2 lg:py-2.5 transition-all duration-500 ease-in-out lg:rounded-full lg:max-w-[800px] xl:max-w-[900px] ${navContainerClass}`}>
                    
                    {/* MOBILE LAYOUT (lg:hidden) */}
                    <div className="flex lg:hidden flex-col w-full gap-1">
                        {showSearchAndSwitchOnTop ? (
                            /* HOME & CATEGORY PAGES MOBILE LAYOUT */
                            <div className="flex w-full items-center justify-between relative py-0.5">
                                {/* LEFT SIDE: Menu & Search */}
                                <div className="flex items-center gap-1.5 z-10 flex-1 justify-start">
                                    <button className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center shrink-0`} aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                        {isMobileMenuOpen ? (
                                            <X className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        ) : (
                                            <Menu className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        )}
                                    </button>
                                    
                                    {/* Little search bar in the place of circle icon */}
                                    <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[70px] max-w-[96px] pointer-events-auto">
                                        <div className="relative flex items-center bg-[#F4F1ED]/80 dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 rounded-full px-2 h-[36px] transition-all focus-within:border-black/25 dark:focus-within:border-white/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                            <Search className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0" strokeWidth={2.5} />
                                            <input 
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full bg-transparent border-none outline-none pl-1.5 text-[10px] font-sans placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-800 dark:text-[#F4F1ED]"
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* CENTER: Logo (Absolute Centered) */}
                                <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center w-fit">
                                    <span className={`text-xl sm:text-2xl font-serif font-bold tracking-widest sm:tracking-[0.2em] uppercase group-hover:opacity-80 transition-colors duration-500 ${logoColor} drop-shadow-sm ml-0.5`}>
                                        TENET
                                    </span>
                                </Link>

                                {/* RIGHT SIDE: Switch & Circle */}
                                <div className="flex items-center gap-1.5 z-10 flex-1 justify-end">
                                    {/* Men and women switch to the right of the logo */}
                                    <div className="shrink-0 origin-right">
                                        <GenderToggle idSuffix="mobile-top-bar" isDesktop={false} isMini={true} />
                                    </div>
                                    
                                    {/* Circle icon replacing cart */}
                                    <Link href="/circle" className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center shrink-0`} aria-label="Open circle">
                                        <Crown className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* STANDARD MOBILE LAYOUT (OTHER PAGES) */
                            <div className="flex w-full items-center justify-between relative py-0.5">
                                {/* LEFT SIDE: Menu, Circle & Home buttons */}
                                <div className="flex items-center gap-1.5 z-10 flex-1 justify-start">
                                    <button className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                        {isMobileMenuOpen ? (
                                            <X className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        ) : (
                                            <Menu className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        )}
                                    </button>
                                    <Link href="/circle" className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center ml-0.5`} aria-label="Open circle">
                                        <Crown className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                    </Link>
                                    {isProductPage && (
                                        <Link href="/" className={`w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center ml-0.5`}>
                                            <Home className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        </Link>
                                    )}
                                </div>

                                {/* CENTER: Logo (Absolute Centered) */}
                                <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center w-fit">
                                    <span className={`text-xl sm:text-2xl font-serif font-bold tracking-widest sm:tracking-[0.2em] uppercase group-hover:opacity-80 transition-colors duration-500 ${logoColor} drop-shadow-sm ml-0.5`}>
                                        TENET
                                    </span>
                                </Link>

                                {/* RIGHT SIDE: Cart */}
                                <div className="flex items-center gap-1 z-10 flex-1 justify-end">
                                    <button className={`relative w-[36px] h-[36px] rounded-full transition-all hover:scale-105 active:scale-95 ${iconGlassBg} flex items-center justify-center`} aria-label="Open cart" onClick={openCart}>
                                        <ShoppingBag className={`w-4 h-4 transition-colors duration-500 ${textColor}`} strokeWidth={iconStroke} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full border border-white dark:border-neutral-900 flex items-center justify-center text-[8px] text-white font-sans font-bold px-1" style={{ backgroundColor: accentColor }}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search Bar and Gender Switcher rendered below the top bar (only on other pages) */}
                        {!isProductPage && !showSearchAndSwitchOnTop && (
                            <div className="flex items-center gap-2.5 w-full px-1 py-1.5 pointer-events-auto">
                                <div className="flex-1 min-w-0">
                                    <SearchBar />
                                </div>
                                <div className="shrink-0 scale-95 origin-right pr-0.5">
                                    <GenderToggle idSuffix="mobile-bar" isDesktop={false} />
                                </div>
                            </div>
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

                            {/* Subtle Divider */}
                            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1" />

                            {/* Theme Toggle (Desktop) */}
                            <div className="flex-shrink-0 origin-center">
                                <ThemeToggle isDesktop={true} />
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
                            className="absolute top-full left-4 right-4 mt-2 pointer-events-auto bg-white/90 dark:bg-[#141414]/90 backdrop-blur-3xl saturate-200 dark:saturate-100 border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[32px] overflow-hidden py-4 z-50"
                        >
                            <div className="flex flex-col">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-center border-b border-neutral-100 dark:border-white/5"
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/#new-arrivals"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-center border-b border-neutral-100 dark:border-white/5"
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-center border-b border-neutral-100 dark:border-white/5"
                                >
                                    ORDERS
                                </Link>
                                <Link
                                    href="/circle"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-center border-b border-neutral-100 dark:border-white/5 flex items-center justify-center gap-2"
                                >
                                    <Crown className="w-4 h-4" strokeWidth={2} />
                                    MY CIRCLE
                                </Link>
                                <SignedIn>
                                    <div className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-4 border-b border-neutral-100 dark:border-white/5">
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
                                            className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors text-center border-b border-neutral-100 dark:border-white/5 w-full flex justify-center items-center gap-2"
                                        >
                                            <User className="w-4 h-4" strokeWidth={2} />
                                            ACCOUNT (LOG IN)
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                
                                <div className="px-6 py-4 border-b border-neutral-100 dark:border-white/5 flex flex-col items-center">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-2 block text-center">Theme Mode</span>
                                    <ThemeToggle />
                                </div>

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
