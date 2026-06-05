"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGender } from "@/context/GenderContext";

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
        <section className="max-w-[2000px] w-full mx-auto px-6 xl:px-12 pt-12 pb-8 lg:pt-16 lg:pb-12">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-6 md:mb-10 border-b border-neutral-100 pb-2 md:pb-4">
                <div className="flex items-baseline gap-4 md:gap-6">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tighter">
                        Shop by Category
                    </h2>
                    <span className="hidden md:inline-block text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">
                        The Edit
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 justify-center">
                {filteredCollections.map((collection) => {
                    const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                    // Select gender-specific cover photo or fallback to default
                    const coverPhoto = CATEGORY_IMAGES[catKey]?.[gender] || collection.imageUrl;

                    return (
                        <Link href={`/collection/${collection.handle}`} key={collection.id}>
                            <div className="relative aspect-[3/4] overflow-hidden group cursor-pointer rounded-lg shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="w-full h-full relative transform transition-transform duration-300 ease-out group-hover:scale-105">
                                    <Image
                                        src={coverPhoto}
                                        alt={collection.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    />
                                    {/* Gradient Overlay - Minimalist Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                <div className="absolute bottom-6 left-6 z-10 text-white pointer-events-none flex items-center gap-3">
                                    <h3 className="font-serif italic text-lg md:text-xl lg:text-2xl tracking-wider drop-shadow-md">
                                        {collection.title}
                                    </h3>
                                    {/* Hover Reveal Arrow using Group Hover */}
                                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
