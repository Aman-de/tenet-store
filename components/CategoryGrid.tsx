"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGender } from "@/context/GenderContext";
import { motion } from "framer-motion";

interface Collection {
    id: string;
    title: string;
    handle: string;
    imageUrl: string;
    description?: string;
    filterTag?: string;
}

// Curated high-aesthetic category cover photos for Men & Women (Served Locally for Instant Load)
const CATEGORY_IMAGES: Record<string, { man?: string; woman?: string }> = {
    knitwear: {
        man: "/images/categories/knitwear-man.jpg",
        woman: "/images/categories/knitwear-woman.jpg"
    },
    accessories: {
        man: "/images/categories/accessories-man.jpg",
        woman: "/images/categories/accessories-woman.webp"
    },
    shirts: {
        man: "/images/categories/shirts-man.webp",
        woman: "/images/categories/shirts-woman.webp"
    },
    jackets: {
        man: "/images/categories/jackets-man.webp",
        woman: "/images/categories/jackets-woman.webp"
    },
    footwear: {
        man: "/images/categories/footwear-man.webp",
        woman: "/images/categories/footwear-woman.jpg"
    },
    outerwear: {
        man: "/images/categories/outerwear-man.webp",
        woman: "/images/categories/outerwear-woman.webp"
    },
    trousers: {
        man: "/images/categories/trousers-man.jpg",
        woman: "/images/categories/trousers-woman.webp"
    },
    pants: {
        man: "/images/categories/pants-man.jpg",
        woman: "/images/categories/pants-woman.webp"
    },
    swimwear: {
        man: "/images/categories/swimwear-man.webp",
        woman: "/images/categories/swimwear-woman.webp"
    },
    sets: {
        man: "/images/categories/sets-man.webp",
        woman: "/images/categories/sets-woman.webp"
    },
    shirting: {
        man: "/images/categories/shirting-man.jpg",
        woman: "/images/categories/shirting-woman.webp"
    },
    lounge: {
        man: "/images/categories/lounge-man.webp",
        woman: "/images/categories/lounge-woman.webp"
    },
    shorts: {
        man: "/images/categories/shorts-man.webp",
        woman: "/images/categories/shorts-woman.webp"
    }
};

export default function CategoryGrid({ collections }: { collections: Collection[] }) {
    const { gender } = useGender();

    if (!collections || collections.length === 0) return null;

    // Filter categories to only the 6 core categories requested for both Men and Women
    const coreCategories = ["shirting", "shirts", "trousers", "pants", "footwear", "accessories", "sets", "shorts"];
    let filteredCollections = collections.filter(collection => {
        const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
        return coreCategories.includes(catKey);
    });

    // Merge 'shirting' and 'shirts' if both exist by removing 'shirting'
    const hasShirts = filteredCollections.some(c => (c.filterTag || c.handle || "").toLowerCase() === "shirts");
    if (hasShirts) {
        filteredCollections = filteredCollections.filter(c => (c.filterTag || c.handle || "").toLowerCase() !== "shirting");
    }
    // Limit to exactly 6 to maintain the grid
    filteredCollections = filteredCollections.slice(0, 6);

    return (
        <section className="max-w-[2000px] w-full mx-auto px-6 xl:px-12 pt-20 pb-16 lg:pt-32 lg:pb-24 bg-[#FDFBF7]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center mb-16 md:mb-24"
            >
                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] tracking-tighter leading-[0.9] mb-6">
                    Shop by <br className="md:hidden" /> Category
                </h2>
                <span className="inline-block text-xs md:text-sm font-bold tracking-[0.3em] text-[#1A1A1A]/40 uppercase">
                    Curated Essentials
                </span>
            </motion.div>

            {/* Apple/Huel Style Asymmetrical Premium Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-center">
                {filteredCollections.map((collection, i) => {
                    const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                    // Select gender-specific cover photo or fallback to default
                    const coverPhoto = CATEGORY_IMAGES[catKey]?.[gender] || collection.imageUrl;
                    
                    // Vary aspect ratios for a more editorial masonry feel on desktop
                    const aspectClass = i % 3 === 0 ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/5]";

                    return (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href={`/collection/${collection.handle}`}>
                                <div className={`relative ${aspectClass} overflow-hidden group cursor-pointer rounded-[32px] md:rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 bg-neutral-100`}>
                                    <div className="w-full h-full relative transform transition-transform duration-[1.5s] ease-out group-hover:scale-105">
                                        <Image
                                            src={coverPhoto}
                                            alt={collection.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        {/* Huel-style very subtle gradient just for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                    </div>

                                    {/* Minimalist Apple-style Typography Overlay */}
                                    <div className="absolute bottom-8 left-8 right-8 z-10 text-white pointer-events-none flex items-center justify-between">
                                        <h3 className="font-serif italic text-2xl md:text-3xl lg:text-4xl tracking-wide drop-shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            {collection.title}
                                        </h3>
                                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center transform transition-all duration-500 ease-out group-hover:bg-white group-hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                                            <ArrowRight className="w-5 h-5 text-white group-hover:text-black transition-colors duration-500" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
