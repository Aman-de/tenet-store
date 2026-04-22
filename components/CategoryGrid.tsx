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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                {collections.map((collection, idx) => (
                    <Link href={`/collection/${collection.handle}`} key={collection.id}>
                        <div className="relative aspect-[3/4] overflow-hidden group cursor-pointer rounded-lg shadow-sm hover:shadow-xl transition-all duration-300">
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

                            <div className="absolute bottom-6 left-6 z-10 text-white pointer-events-none flex items-center gap-3">
                                <h3 className="font-serif italic text-lg md:text-xl lg:text-2xl tracking-wider drop-shadow-md">
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
