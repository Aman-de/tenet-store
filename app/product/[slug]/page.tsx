import { getProduct, getProducts, getRecommendedProducts, getReviews } from "@/lib/sanity";
import { notFound, redirect } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import RecommendedProducts from "@/components/RecommendedProducts";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export const revalidate = 60; // ISR cache for 60 seconds

export async function generateStaticParams() {
    const products = await getProducts();
    return products
        .filter((product) => product.handle && typeof product.handle === "string" && product.handle.trim() !== "")
        .map((product) => ({
            slug: product.handle,
        }));
}

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Async component for recommendations — streams in after initial page paint
async function RecommendationsSection({ category, slug, gender }: { category: string; slug: string; gender?: string }) {
    const recommendations = await getRecommendedProducts(category, slug, gender);
    return (
        <div className="max-w-[2000px] w-full mx-auto px-4 md:px-6 xl:px-12 mb-12">
            <RecommendedProducts products={recommendations} />
        </div>
    );
}

export default async function ProductPage({ params }: ProductPageProps) {
    // Unwrap params using React.use() or await as recommended in Next.js 15
    const { slug } = await params;

    const decodedSlug = decodeURIComponent(slug);
    const cleanSlug = decodedSlug.split(/\s+/)[0];
    if (cleanSlug !== slug && cleanSlug !== decodedSlug) {
        redirect(`/product/${cleanSlug}`);
    } else if (cleanSlug !== slug) {
        redirect(`/product/${cleanSlug}`);
    }

    const product = await getProduct(cleanSlug);

    if (!product) {
        notFound();
    }

    // Fetch reviews immediately (needed for above-the-fold content)
    const reviews = await getReviews(product.id);

    return (

        <main className="min-h-screen pb-20 pt-0 -mt-2 lg:-mt-3">
            <ProductDetails product={product} reviews={reviews} />
            {/* Recommendations stream in after the main product renders */}
            <Suspense fallback={
                <div className="max-w-[2000px] w-full mx-auto px-4 md:px-6 xl:px-12 mb-12">
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16 mt-20 md:mt-32">
                        <div className="w-48 h-8 bg-neutral-200 dark:bg-neutral-800 mx-auto mb-12 animate-pulse rounded" />
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-10 lg:gap-y-16">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i}>
                                    <div className="w-full aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 mb-4 animate-pulse" />
                                    <div className="w-3/4 h-4 bg-neutral-200 dark:bg-neutral-800 mb-2 animate-pulse rounded" />
                                    <div className="w-1/2 h-3 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <RecommendationsSection category={product.category} slug={product.handle} gender={product.gender} />
            </Suspense>
            <Footer />
        </main>
    );
}
