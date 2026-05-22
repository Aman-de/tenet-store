import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import CategoryGrid from "@/components/CategoryGrid"; // Import
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { getProducts, getCollections } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  const collections = await getCollections();

  // Curate top "best" products for the Hero carousel, ensuring apparel/models
  const spotlightProducts = [...products]
    .filter(p => !p.isOutOfStock && p.category && !['accessories', 'fragrance', 'perfume', 'shoes'].includes(p.category.toLowerCase()))
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <Hero spotlightProducts={spotlightProducts} />

      {/* Category Grid Section */}
      <CategoryGrid collections={collections} />

      {/* Editorial Campaign Section */}
      <section className="max-w-[2000px] mx-auto px-6 xl:px-12 py-12">
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col lg:flex-row items-stretch">
          <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[600px] overflow-hidden">
            <Image
              src="/images/editorial_campaign.png"
              alt="TENET Archives Editorial Campaign"
              fill
              className="object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2 p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-white">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-4 block">
              Editorial Campaign
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-[1.1] mb-6">
              A Quiet Luxury <br />Design Language
            </h2>
            <p className="font-sans text-neutral-500 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Spun from multi-generational weavers, our classic collections feature structured cable-knit sweaters, breathable linen popovers, and tailored Gurkha trousers designed to endure across seasons. Clean silhouettes, premium organic threads, and absolute modularity.
            </p>
            <div>
              <Link
                href="/#new-arrivals"
                className="inline-block group/btn px-8 py-4 border border-black text-black transition-all duration-300 tracking-[0.2em] text-xs font-bold uppercase backdrop-blur-sm relative overflow-hidden active:scale-95"
              >
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">View Collections</span>
                <div className="absolute inset-0 bg-[#1A1A1A] transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section with Category Filter */}
      <div>
        <ProductSection products={products} />
      </div>

      <TrustBar />
      <Footer />
    </main>
  );
}

