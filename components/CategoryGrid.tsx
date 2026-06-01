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
const CATEGORY_IMAGES: Record<string, { man: string; woman: string }> = {
    knitwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/6c3db6c7a574fe47ea84a22cb1af12b9dde253bb-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/4b998246d8c90396fb10b2df7e96b34cfdb2bb5a-1125x1688.jpg"
    },
    accessories: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/2cbb891f218dccdefb311af77fed2d2e1abc1473-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/2cbb891f218dccdefb311af77fed2d2e1abc1473-1024x1024.jpg"
    },
    shirts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/29e84824821367d32232ee2fdbc7aa93d3a6fd71-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/14edb89b15b36be734a72bfe3506a495bd7fd043-1024x1024.jpg"
    },
    jackets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/ef5d45ee0ae8df70f9f8b5e10e0c0a92c1b1976c-640x640.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/b6f311a9a3aba454ebb47f9ee63ed3a94de98e89-640x640.jpg"
    },
    footwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/f05210eb953a188ea5420e576752b600ca7ad7eb-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/f05210eb953a188ea5420e576752b600ca7ad7eb-1024x1024.jpg"
    },
    outerwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/bdd03160a087d30ab522041b736083861500586a-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/117ef8a141e8002d9be68181043e221fcde5d2d8-1125x1688.jpg"
    },
    trousers: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/9adb4b3f103f4bdde371dcaad28f0e8070d3ac80-994x1500.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/14dbf30d573a06d12a808b4e05baea4c39ad3041-1125x1688.jpg"
    },
    pants: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/9adb4b3f103f4bdde371dcaad28f0e8070d3ac80-994x1500.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/14dbf30d573a06d12a808b4e05baea4c39ad3041-1125x1688.jpg"
    },
    swimwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/6e13986721184fc00b1a90f4a514b6449bd9ab25-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/6e13986721184fc00b1a90f4a514b6449bd9ab25-1024x1024.jpg"
    },
    sets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/7e056f1f0586bb44848798acf10950a070ce6c5e-640x640.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/7e056f1f0586bb44848798acf10950a070ce6c5e-640x640.jpg"
    },
    shirting: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/6c09616307c89c67743c1c3d186fd2cda0e7371b-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/9a82a1bf981d5953889bd0bcc093e21ffef7d645-800x1000.webp"
    },
    lounge: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/a08cd83029c2ed735d94ce28a2362d99fdc8edd1-1024x1024.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/0aeadafae8ab939961d6403f6f9e1325d837adda-800x1000.jpg"
    },
    shorts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/a4b0a74a416c43850db3f606391f457dc5f4685c-640x640.jpg",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/e4d3d80b5dc7e206d6fb1e89610ba56a7eec0ff9-640x640.jpg"
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
