import { getProduct, getRecommendedProducts, getReviews } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetails from "@/components/ProductDetails";
import RecommendedProducts from "@/components/RecommendedProducts";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    // Unwrap params using React.use() or await as recommended in Next.js 15
    const { slug } = await params;

    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const recommendations = await getRecommendedProducts(product.category, product.handle);
    const reviews = await getReviews(product.id);

    return (

        <main className="bg-[#FDFBF7] min-h-screen pb-20">
            <Navbar />
            <ProductDetails product={product} reviews={reviews} />
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <RecommendedProducts products={recommendations} />
            </div>
        </main>
    );
}

