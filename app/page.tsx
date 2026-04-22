import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import CategoryGrid from "@/components/CategoryGrid"; // Import
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { getProducts, getCollections } from "@/lib/sanity";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  const collections = await getCollections();

  // Curate top "best" products for the Hero carousel
  const spotlightProducts = [...products]
    .filter(p => !p.isOutOfStock)
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <Hero spotlightProducts={spotlightProducts} />

      {/* Category Grid Section */}
      <CategoryGrid collections={collections} />

      {/* Product Section with Category Filter */}
      <div>
        <ProductSection products={products} />
      </div>

      <TrustBar />
      <Footer />
    </main>
  );
}

