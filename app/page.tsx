import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";
import CategoryGrid from "@/components/CategoryGrid"; // Import
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { getProducts, getCollections } from "@/lib/sanity";

export default async function Home() {
  const products = await getProducts();
  const collections = await getCollections();

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <Navbar />
      <Hero />

      {/* Category Grid Section */}
      <CategoryGrid collections={collections} />

      {/* Product Section with Category Filter */}
      <div className="py-12 md:py-24">
        <ProductSection products={products} />
      </div>

      <TrustBar />
      <Footer />
    </main>
  );
}

