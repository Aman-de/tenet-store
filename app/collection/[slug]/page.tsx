import Footer from "@/components/Footer";
import SortedProductGrid from "@/components/SortedProductGrid";
import { getCollection } from "@/lib/sanity";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const collection = await getCollection(slug);

    if (!collection) {
        notFound();
    }

    return (
        <main className="bg-[#FDFBF7] min-h-screen">

            {/* Compact Header with Sort */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
                {/* Title Row with Sort */}
                <div className="flex items-baseline justify-between mb-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] tracking-tight">{collection.title}</h1>
                </div>
                {collection.description && (
                    <p className="text-[#1A1A1A]/70 text-sm font-sans max-w-lg leading-relaxed mb-3">{collection.description}</p>
                )}

                {/* Sorted Product Grid with dynamic Size Filter */}
                <SortedProductGrid
                    products={collection.products}
                    sizeType={collection.sizeType}
                />
            </section>

            <Footer />
        </main>
    );
}
