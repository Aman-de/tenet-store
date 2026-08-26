"use client";

import { useGender } from "@/context/GenderContext";
import BentoHero from "@/components/BentoHero";
import ProductSection from "@/components/ProductSection";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles, CheckCircle2, Star } from "lucide-react";
import RakhiFestiveBanner from "@/components/RakhiFestiveBanner";

interface HomePageClientProps {
    products: any[];
    collections: any[];
}

export default function HomePageClient({ products, collections }: HomePageClientProps) {
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const cardBg = gender === "woman"
        ? "bg-[#FCF0F2] dark:bg-[#160F11]"
        : gender === "man"
            ? "bg-[#F0F4F8] dark:bg-[#0E1217]"
            : gender === "gadget"
                ? "bg-[#FAF5FF] dark:bg-[#130E1C]"
                : "bg-neutral-50 dark:bg-neutral-900/50";

    // Dynamically filter spotlight products based on selected gender/view
    const spotlightProducts = products
        .filter(p => {
            if (p.isOutOfStock) return false;
            
            const cat = p.category ? p.category.toLowerCase() : "";
            
            if (gender === "gadget") {
                return cat === "gadgets" || cat === "electronics";
            }
            if (gender === "all") {
                return true;
            }
            
            // Standard Men/Women filtering
            if (cat === "gadgets" || cat === "electronics") return false;
            
            const g = p.gender ? p.gender.toLowerCase() : "woman";
            return gender === "man"
                ? (g === "man" || g === "unisex")
                : (g === "woman" || g === "unisex");
        })
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);

    // Filter bestseller products for the active view
    const bestsellerProducts = products
        .filter(p => {
            const cat = p.category ? p.category.toLowerCase() : "";
            
            if (gender === "gadget") {
                return cat === "gadgets" || cat === "electronics";
            }
            if (gender === "all") {
                return true;
            }
            
            // Standard Men/Women filtering
            if (cat === "gadgets" || cat === "electronics") return false;
            
            const g = p.gender ? p.gender.toLowerCase() : "woman";
            return gender === "man"
                ? (g === "man" || g === "unisex")
                : (g === "woman" || g === "unisex");
        })
        .sort((a, b) => {
            if (a.isBestSeller && !b.isBestSeller) return -1;
            if (!a.isBestSeller && b.isBestSeller) return 1;
            if (a.isBestSeller && b.isBestSeller) {
                const rankA = a.bestSellerRank ?? 999;
                const rankB = b.bestSellerRank ?? 999;
                return rankA - rankB;
            }
            return b.price - a.price;
        })
        .slice(0, 8);

    const reviews = isWoman ? [
        { name: "Neha S., Mumbai", rating: 5, location: "Verified Patron", quote: "The organic linen drape is truly unparalleled. Feels so comfortable in the humid heat while looking exceptionally chic.", img: "/images/hero-women.webp" },
        { name: "Riya M., Bangalore", rating: 5, location: "Verified Patron", quote: "Breathtaking craftsmanship. The finish of the co-ord set received so many compliments at brunch.", img: "/images/categories/knitwear-woman.jpg" },
        { name: "Aarti K., Delhi", rating: 5, location: "Verified Patron", quote: "The bespoke packaging and express delivery made unboxing feel like a luxury experience in Milan.", img: "/images/categories/shirts-woman.webp" }
    ] : [
        { name: "Amit V., Delhi", rating: 5, location: "Verified Patron", quote: "Extremely premium Italian linen. The tailoring fits perfectly around the shoulders without feeling tight.", img: "/images/hero-main.webp" },
        { name: "Vikram R., Mumbai", rating: 5, location: "Verified Patron", quote: "The Gurkha trousers are hands down the best investment piece in my wardrobe this season.", img: "/images/categories/trousers-man.jpg" },
        { name: "Kabir N., Bangalore", rating: 5, location: "Verified Patron", quote: "Impeccable finish. From the stitch density to the horn buttons, every detail screams quiet luxury.", img: "/images/categories/shirts-man.webp" }
    ];

    const summerEditBg = isWoman ? '/images/editorial_campaign_women.webp' : '/images/editorial_campaign.webp';

    const bestsellerViewAllHref = gender === "woman" 
        ? '/search?gender=woman' 
        : gender === "man"
            ? '/search?gender=man'
            : gender === "gadget"
                ? '/search?gender=gadget'
                : '/search';

    return (
        <div className="min-h-screen">
            {/* Unified Bento Box Hero & Categories */}
            <BentoHero spotlightProducts={spotlightProducts} collections={collections} />

            {/* 🪢 Rakhi Festive Gifting Banner & Value Highlights */}
            <RakhiFestiveBanner />

            {/* BESTSELLERS SLIDER */}
            <div className="w-full pt-1 pb-4 lg:py-6">
                <div className="flex items-center justify-between mb-3 px-4 lg:px-12">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#E0A96D]">Curated Icons</span>
                        <h2 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#F4F1ED]">
                            Archival Bestsellers
                        </h2>
                    </div>
                    <Link href={bestsellerViewAllHref} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        <span>View All</span>
                        <ArrowRight className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                    </Link>
                </div>
                
                {/* Horizontal Scroll Container */}
                <div className="flex gap-3 lg:gap-6 overflow-x-auto px-4 lg:px-12 pb-4 scrollbar-none snap-x snap-mandatory">
                    {bestsellerProducts.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-[155px] sm:w-[185px] lg:w-[260px] snap-align-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILED TRUST RIBBON (Desktop) */}
            <div className="hidden lg:block w-full px-12 py-4">
                <div className={`${cardBg} border border-black/5 dark:border-white/10 rounded-3xl p-7 grid grid-cols-4 gap-6 shadow-xs`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6 text-neutral-900 dark:text-[#F4F1ED]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-xs font-bold text-neutral-900 dark:text-[#F4F1ED] uppercase tracking-wider">Complimentary Express</span>
                            <span className="font-sans text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Free 2-4 day delivery across India</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <RefreshCw className="w-6 h-6 text-neutral-900 dark:text-[#F4F1ED]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-xs font-bold text-neutral-900 dark:text-[#F4F1ED] uppercase tracking-wider">7-Day Doorstep Exchange</span>
                            <span className="font-sans text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Hassle-free size & style swaps</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-neutral-900 dark:text-[#F4F1ED]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-xs font-bold text-neutral-900 dark:text-[#F4F1ED] uppercase tracking-wider">Artisanal Authenticity</span>
                            <span className="font-sans text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">100% genuine luxury materials</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-neutral-900 dark:text-[#F4F1ED]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-xs font-bold text-neutral-900 dark:text-[#F4F1ED] uppercase tracking-wider">Bespoke Gift Boxing</span>
                            <span className="font-sans text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Included on every order</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Section with Category Filter */}
            <div className="pt-2">
                <ProductSection products={products} />
            </div>

            {/* EDITORIAL CAMPAIGN BANNER */}
            <div className="w-full px-4 lg:px-12 py-8">
                <div className="relative w-full h-[260px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl flex items-center border border-black/5 dark:border-white/10">
                    <Image
                        src={summerEditBg}
                        alt="Curated Editorial Campaign"
                        fill
                        sizes="100vw"
                        className="object-cover object-center transform transition-transform duration-[10s] hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                    
                    <div className="relative z-10 pl-6 md:pl-16 max-w-xl text-left flex flex-col items-start justify-center">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#E0A96D] mb-2">
                            Seasonal Lookbook
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl font-normal text-white leading-tight mb-2 drop-shadow-md">
                            {isWoman ? "The Festive & Solstice Edit" : "The Riviera & Resort Edit"}
                        </h2>
                        <p className="font-sans text-xs md:text-base text-neutral-200 mb-6 drop-shadow-sm font-light leading-relaxed">
                            Bespoke tailoring, breathable natural blends, and quiet luxury finishes.
                        </p>
                        <Link 
                            href="/#new-arrivals" 
                            className="inline-flex items-center justify-between gap-3 bg-white text-black hover:bg-neutral-100 px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl font-sans"
                        >
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                                Explore The Lookbook
                            </span>
                            <ArrowRight className="w-4 h-4 text-black" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* PATRON IMPRESSIONS & VERIFIED REVIEWS */}
            <div className="w-full px-4 lg:px-12 pt-4 pb-12">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#E0A96D]">Client Testimonials</span>
                        <h2 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#F4F1ED]">
                            Patron Impressions
                        </h2>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                        <span className="text-[#E0A96D]">★★★★★</span>
                        <span>4.9 / 5 Overall Score</span>
                    </div>
                </div>
                
                {/* Horizontal Review Scroll Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {reviews.map((rev, index) => (
                        <div 
                            key={index} 
                            className={`${cardBg} border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-xs transition-transform hover:scale-[1.01]`}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-black/5 dark:border-white/10">
                                    <Image
                                        src={rev.img}
                                        alt={rev.name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-sm font-bold text-neutral-900 dark:text-[#F4F1ED]">
                                        {rev.name}
                                    </span>
                                    <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>{rev.location}</span>
                                    </div>
                                    <div className="flex text-amber-400 text-[11px] mt-1">
                                        {"★".repeat(rev.rating)}
                                    </div>
                                </div>
                            </div>
                            <p className="font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 italic">
                                "{rev.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
