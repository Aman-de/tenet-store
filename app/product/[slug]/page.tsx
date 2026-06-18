import { getProduct, getRecommendedProducts, getReviews } from "@/lib/sanity";
import { notFound, redirect } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import RecommendedProducts from "@/components/RecommendedProducts";
import Footer from "@/components/Footer";

export const revalidate = 60; // ISR cache for 60 seconds

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
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

    const recommendations = await getRecommendedProducts(product.category, product.handle, product.gender);
    const reviews = await getReviews(product.id);

    return (

        <main className="min-h-screen pb-20 pt-[48px] lg:pt-[96px]">
            <ProductDetails product={product} reviews={reviews} />
            <div className="max-w-[2000px] w-full mx-auto px-4 md:px-6 xl:px-12 mb-12">
                <RecommendedProducts products={recommendations} />
            </div>
            <Footer />
        </main>
    );
}

