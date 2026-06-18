import Footer from "@/components/Footer";
import SortedProductGrid from "@/components/SortedProductGrid";
import { getCollection } from "@/lib/sanity";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from 'next';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const decodedSlug = decodeURIComponent(slug);
    const cleanSlug = decodedSlug.split(/\s+/)[0];
    if (cleanSlug !== slug && cleanSlug !== decodedSlug) {
        redirect(`/collection/${cleanSlug}`);
    } else if (cleanSlug !== slug) {
        redirect(`/collection/${cleanSlug}`);
    }

    const collection = await getCollection(cleanSlug);

    if (!collection) {
        notFound();
    }

    return (
        <main className="min-h-screen">

            {/* Compact Header with Sort */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
                {/* Title Row with Sort */}
                <div className="flex items-baseline justify-between mb-1">
                    <h1 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] dark:text-[#F4F1ED] tracking-tight">{collection.title}</h1>
                </div>
                {collection.description && (
                    <p className="text-[#1A1A1A] dark:text-[#F4F1ED]/70 text-sm font-sans max-w-lg leading-relaxed mb-3">{collection.description}</p>
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
