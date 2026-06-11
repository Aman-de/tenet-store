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

// Curated high-aesthetic category cover photos for Men & Women
const CATEGORY_IMAGES: Record<string, { man?: string; woman?: string }> = {
    knitwear: {
        man: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1024",
        woman: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1024"
    },
    accessories: {
        man: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/631cae490b81cba20ad3bde888e83f8a9437522a-1024x1024.webp"
    },
    shirts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/8164623b78c4f923de6713c2f0c580e71acdccc9-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/785069aedf180182e39693484ad92b0c10acd092-1024x1024.webp"
    },
    jackets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/d2c8d62d29da7a292041906aef8baf0ec4052676-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5b5c0311f171c46cb66515c24304b7e61f48bd1e-640x640.webp"
    },
    footwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/b87b417450fae7281a6b41ead55e74f43c897fb7-1024x1024.webp",
        woman: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1024"
    },
    outerwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/7dc9cb85576054710c3cf2d7c05878b97c6c3eb2-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5437d499c94607847f4aec1971df6cc28312d366-1125x1688.webp"
    },
    trousers: {
        man: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/86589d169a8de56c24f78ce765ceffc7eeba5419-1125x1688.webp"
    },
    pants: {
        man: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/86589d169a8de56c24f78ce765ceffc7eeba5419-1125x1688.webp"
    },
    swimwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/85949fe7c5800a01a9ba444f84e20b5f1c6590e4-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/85949fe7c5800a01a9ba444f84e20b5f1c6590e4-1024x1024.webp"
    },
    sets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/04767c2b24c268b17549176dd331fdac21ab55fd-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/779ef235f4592467c99bde5ef7774e73f4334d80-1024x1024.webp"
    },
    shirting: {
        man: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/9a82a1bf981d5953889bd0bcc093e21ffef7d645-800x1000.webp"
    },
    lounge: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/c1363a27626d89034b79adc7d043c505ce39910e-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5f86d7ffaa9f8beae1acda5d56713544228e9635-800x1000.webp"
    },
    shorts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/e2c3ba688850b272c1c51d6809e1781b26caf163-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/11a3669561183f64048557a9a53a465f858dbedd-640x640.webp"
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
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                                            <ArrowRight className="w-5 h-5 text-white" />
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
