"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-col items-center gap-4 mb-8">
            <h2 className="font-serif text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">
                New and Popular
            </h2>

            <div className="w-full max-w-full overflow-x-auto scrollbar-hide">
                <div className="flex justify-start md:justify-center items-center gap-3 px-4 min-w-max">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onSelect(category)}
                            className={cn(
                                "px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 border",
                                activeCategory === category
                                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                    : "bg-white text-[#1A1A1A] border-neutral-200 hover:border-[#1A1A1A]"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
