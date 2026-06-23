"use client";

import { useGender } from "@/context/GenderContext";
import BentoHero from "@/components/BentoHero";
import ProductSection from "@/components/ProductSection";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";

interface HomePageClientProps {
    products: any[];
    collections: any[];
}

export default function HomePageClient({ products, collections }: HomePageClientProps) {
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const cardBg = isWoman ? "bg-[#FFF2F4] dark:bg-[#1C1416]" : "bg-[#F4F8FC] dark:bg-[#12161B]";

    // Dynamically filter spotlight products based on selected gender
    const spotlightProducts = products
        .filter(p => {
            const g = p.gender ? p.gender.toLowerCase() : "man";
            const isCorrectGender = gender === "man"
                ? (g === "man" || g === "unisex")
                : (g === "woman" || g === "unisex");
            return isCorrectGender && !p.isOutOfStock && p.category && !["accessories", "fragrance", "perfume", "shoes"].includes(p.category.toLowerCase());
        })
        .sort((a, b) => b.price - a.price)
        .slice(0, 10);

    // Filter bestseller products for the active gender
    const bestsellerProducts = products
        .filter(p => {
            const g = p.gender ? p.gender.toLowerCase() : "man";
            const isCorrectGender = gender === "man"
                ? (g === "man" || g === "unisex")
                : (g === "woman" || g === "unisex");
            return isCorrectGender;
        })
        .slice(0, 6);

    const reviews = isWoman ? [
        { name: "Neha, Mumbai", rating: 5, quote: "Love the fabric & fit! So comfortable and elegant.", img: "/images/hero-women.webp" },
        { name: "Riya, Bangalore", rating: 5, quote: "Perfect for summer! Light, breathable & stylish.", img: "/images/categories/knitwear-woman.jpg" },
        { name: "Aarti, Pune", rating: 5, quote: "Beautiful quality and the fit is just perfect!", img: "/images/categories/shirts-woman.webp" }
    ] : [
        { name: "Amit, Delhi", rating: 5, quote: "Extremely premium linen. The tailoring fits perfectly.", img: "/images/hero-main.webp" },
        { name: "Vikram, Mumbai", rating: 5, quote: "Highly recommend the Gurkha trousers. Super comfortable.", img: "/images/categories/trousers-man.jpg" },
        { name: "Kabir, Chennai", rating: 5, quote: "The styling suggestions in the lookbook are top-notch.", img: "/images/categories/shirts-man.webp" }
    ];

    const summerEditBg = isWoman ? '/images/editorial_campaign_women.webp' : '/images/editorial_campaign.webp';

    return (
        <div className="min-h-screen">
            {/* Unified Bento Box Hero & Categories */}
            <BentoHero spotlightProducts={spotlightProducts} collections={collections} />

            {/* BESTSELLERS SLIDER */}
            <div className="w-full px-6 xl:px-12 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#F4F1ED] uppercase">
                        Bestsellers
                    </h2>
                    <Link href={`/collection/${isWoman ? 'sets' : 'shirts'}`} className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-[#F4F1ED] hover:opacity-80 transition-opacity">
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                
                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                    {bestsellerProducts.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-[180px] md:w-[240px] snap-align-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILED TRUST RIBBON */}
            <div className="w-full px-6 xl:px-12 py-6">
                <div className={`${cardBg} border border-neutral-200/40 dark:border-white/5 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 shadow-sm`}>
                    <div className="flex items-center gap-3.5 p-1 md:justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-neutral-800 dark:text-[#F4F1ED]/90" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-[11px] font-bold text-neutral-800 dark:text-[#F4F1ED]/90 uppercase tracking-wider">Free Shipping</span>
                            <span className="font-sans text-[9px] text-neutral-400 dark:text-neutral-500">On prepaid orders</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-1 md:justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <RefreshCw className="w-5 h-5 text-neutral-800 dark:text-[#F4F1ED]/90" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-[11px] font-bold text-neutral-800 dark:text-[#F4F1ED]/90 uppercase tracking-wider">Easy Returns</span>
                            <span className="font-sans text-[9px] text-neutral-400 dark:text-neutral-500">7 days return</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-1 md:justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-neutral-800 dark:text-[#F4F1ED]/90" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-[11px] font-bold text-neutral-800 dark:text-[#F4F1ED]/90 uppercase tracking-wider">Secure Payments</span>
                            <span className="font-sans text-[9px] text-neutral-400 dark:text-neutral-500">100% safe</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 p-1 md:justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-neutral-800 dark:text-[#F4F1ED]/90" strokeWidth={1.5} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                                <path d="M6 14h.01M10 14h.01" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-sans text-[11px] font-bold text-neutral-800 dark:text-[#F4F1ED]/90 uppercase tracking-wider">COD Available</span>
                            <span className="font-sans text-[9px] text-neutral-400 dark:text-neutral-500">Cash on delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Section with Category Filter */}
            <div>
                <ProductSection products={products} />
            </div>

            {/* CUSTOMER REVIEWS SLIDER */}
            <div className="w-full px-6 xl:px-12 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#F4F1ED] uppercase">
                        {isWoman ? "Loved By Real Women" : "Loved By Real Men"}
                    </h2>
                    <button onClick={() => alert("All review pages are currently integrated under product details.")} className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-[#F4F1ED] hover:opacity-80 transition-opacity">
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                
                {/* Horizontal Review Scroll Container */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                    {reviews.map((rev, index) => (
                        <div 
                            key={index} 
                            className={`flex-shrink-0 w-[280px] md:w-[320px] ${cardBg} border border-neutral-200/40 dark:border-white/5 rounded-2xl p-4 flex gap-4 items-center snap-align-start shadow-sm`}
                        >
                            {/* Photo Left */}
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={rev.img}
                                    alt={rev.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>
                            
                            {/* Text Right */}
                            <div className="flex flex-col text-left justify-center flex-1 min-w-0">
                                <span className="font-sans text-xs font-bold text-neutral-800 dark:text-[#F4F1ED] truncate">
                                    {rev.name}
                                </span>
                                <div className="flex text-amber-500 text-[10px] my-1">
                                    {"★".repeat(rev.rating)}
                                </div>
                                <p className="font-sans text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400 italic line-clamp-3">
                                    "{rev.quote}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CAMPAIGN BANNER */}
            <div className="w-full px-6 xl:px-12 py-8 mb-4">
                <div className="relative w-full h-[220px] md:h-[360px] rounded-3xl overflow-hidden shadow-md flex items-center">
                    <Image
                        src={summerEditBg}
                        alt="Summer Edit"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    
                    <div className="relative z-10 pl-6 md:pl-16 text-left flex flex-col items-start justify-center">
                        <h2 className="font-serif text-2xl md:text-5xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-md">
                            {isWoman ? "The Summer Edit" : "The Resort Edit"}
                        </h2>
                        <p className="font-sans text-xs md:text-lg text-white/90 mb-6 drop-shadow-sm font-medium tracking-wide">
                            Light. Breezy. Effortless.
                        </p>
                        <Link 
                            href="#new-arrivals" 
                            className="flex items-center justify-between gap-3 bg-white text-[#1A1A1A] hover:bg-neutral-50 px-5 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md font-sans"
                        >
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                Shop The Edit
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* FLOATING WHATSAPP WIDGET */}
            <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-[#25D366] hover:bg-[#20BA56] rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/10"
                aria-label="Contact us on WhatsApp"
            >
                <Image
                    src="/whatsapp-logo.svg"
                    alt="WhatsApp"
                    width={26}
                    height={26}
                />
            </a>
        </div>
    );
}
