
import { searchProducts } from "@/lib/sanity";
import SortedProductGrid from "@/components/SortedProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search Results | TENET",
    description: "Search results for Tenet products.",
};

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = typeof q === "string" ? q : "";

    const products = query ? await searchProducts(query) : [];

    return (
        <main className="bg-[#FDFBF7] min-h-screen">
            {/* Header */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-8">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">Search Results</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                        {query ? `"${query}"` : "All Products"}
                    </h1>
                    <p className="text-neutral-500 font-sans text-sm mt-1">
                        {products.length} {products.length === 1 ? "result" : "results"} found
                    </p>
                </div>
            </section>

            {/* Results Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
                <SortedProductGrid products={products} sizeType="mixed" />
            </section>

            <Footer />
        </main>
    );
}
