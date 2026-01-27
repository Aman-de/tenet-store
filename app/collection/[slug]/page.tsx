import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SortedProductGrid from "@/components/SortedProductGrid";
import { getCollection } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const collection = await getCollection(slug);

    if (!collection) {
        notFound();
    }

    return (
        <main className="bg-[#FDFBF7] min-h-screen">
            <Navbar />

            {/* Concise Premium Header */}
            <div className="relative h-80 w-full">
                <Image
                    src={collection.imageUrl}
                    alt={collection.title}
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Breadcrumbs - Absolute Top Left */}
                <div className="absolute top-6 left-6 md:left-10 z-20">
                    <nav className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-medium">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">{collection.title}</span>
                    </nav>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-white text-4xl font-serif mb-2">{collection.title}</h1>
                        {collection.description && (
                            <p className="text-white/80 text-sm font-sans max-w-lg leading-relaxed">{collection.description}</p>
                        )}
                    </div>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
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
