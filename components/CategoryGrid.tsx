"use client";

import { motion } from "framer-motion";
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
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
            <div className="flex flex-col items-center mb-10 text-center">
                <span className="text-[11px] font-medium tracking-[0.25em] text-neutral-500 uppercase mb-2">
                    The Edit
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] tracking-tighter">
                    Shop by Category
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {collections.map((collection, idx) => (
                    <Link href={`/collection/${collection.handle}`} key={collection.id}>
                        <motion.div
                            className="relative aspect-square overflow-hidden group cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >

                            <motion.div
                                className="w-full h-full relative"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.7, ease: "easeOut" }} // Duration 700ms
                            >
                                <Image
                                    src={collection.imageUrl}
                                    alt={collection.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Gradient Overlay - Minimalist Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </motion.div>

                            <div className="absolute bottom-6 left-6 z-10 text-white pointer-events-none flex items-center gap-2">
                                <h3 className="font-serif italic text-lg md:text-2xl tracking-wider drop-shadow-md">
                                    {collection.title}
                                </h3>
                                {/* Hover Reveal Arrow using Group Hover */}
                                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
