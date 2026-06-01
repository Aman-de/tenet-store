import HomePageClient from "@/components/HomePageClient";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import { getProducts, getCollections } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const collections = await getCollections();

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      <HomePageClient products={products} collections={collections} />
      <TrustBar />
      <Footer />
    </main>
  );
}
