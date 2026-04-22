"use client";

// Framer motion removed for instant rendering
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Collection {
    id: string;
    title: string;
    handle: string;
    imageUrl: string;
    description?: string;
}

export default function CategoryGrid({ collections }: { collections: Collection[] }) {
    if (!collections || collections.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-2">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-4 border-b border-neutral-100 pb-2">
                <div className="flex items-baseline gap-4">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tighter">
                        Shop by Category
                    </h2>
                    <span className="hidden md:inline-block text-[10px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                        The Edit
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
                {collections.map((collection, idx) => (
                    <Link href={`/collection/${collection.handle}`} key={collection.id}>
                        <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer rounded-sm">
                            <div className="w-full h-full relative transform transition-transform duration-300 ease-out group-hover:scale-105">
                                <Image
                                    src={collection.imageUrl}
                                    alt={collection.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Gradient Overlay - Minimalist Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute bottom-4 left-4 z-10 text-white pointer-events-none flex items-center gap-2">
                                <h3 className="font-serif italic text-sm md:text-base tracking-wider drop-shadow-md">
                                    {collection.title}
                                </h3>
                                {/* Hover Reveal Arrow using Group Hover */}
                                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
