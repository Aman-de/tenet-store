"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGender } from "@/context/GenderContext";
import BentoHero from "@/components/BentoHero";
import ProductSection from "@/components/ProductSection";

interface HomePageClientProps {
    products: any[];
    collections: any[];
}

export default function HomePageClient({ products, collections }: HomePageClientProps) {
    const { gender } = useGender();

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

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Unified 100vh Bento Box Hero & Categories */}
            <BentoHero spotlightProducts={spotlightProducts} collections={collections} />

            {/* Product Section with Category Filter */}
            <div>
                <ProductSection products={products} />
            </div>
        </div>
    );
}
