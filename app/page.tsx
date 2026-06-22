import HomePageClient from "@/components/HomePageClient";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { getProducts, getCollections } from "@/lib/sanity";

export const revalidate = 60; // ISR cache for 60 seconds

export default async function Home() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return (
    <main className="min-h-screen">
      <HomePageClient products={products} collections={collections} />
      <Footer />
    </main>
  );
}
