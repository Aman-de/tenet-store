import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Campaign | A Quiet Luxury & Effortless Elegance | TENET",
  description: "Discover TENET's editorial campaign. Experience a design language spun from multi-generational weavers, featuring Italian wool-cashmere yarns, clean silhouettes, and absolute modularity for both men and women.",
  keywords: "Quiet Luxury, Effortless Elegance, Premium Fashion, Italian Wool Cashmere, Organic Threads, Classic Collections, TENET Editorial",
  openGraph: {
    title: "Editorial Campaign | A Quiet Luxury | TENET",
    description: "Discover our latest collections featuring clean silhouettes, premium organic threads, and absolute modularity.",
    images: ["/images/editorial_campaign.webp"],
  }
};

export default function EditorialPage() {
  return (
    <main className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen pt-24 pb-20">
      <div className="max-w-[2000px] mx-auto px-6 xl:px-12">
        {/* Page Header */}
        <header className="text-center mb-16 md:mb-24">
          <h1 className="font-serif text-4xl md:text-6xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-6">
            The Editorial Campaign
          </h1>
          <p className="font-sans text-neutral-500 max-w-2xl mx-auto text-lg">
            Immerse yourself in our design philosophy. A commitment to timeless aesthetics, superior craftsmanship, and sustainable elegance.
          </p>
        </header>

        {/* Men's Campaign Section */}
        <section className="mb-24 lg:mb-32">
          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col lg:flex-row items-stretch group">
            <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[600px] overflow-hidden">
              <Image
                src="/images/editorial_campaign.webp"
                alt="TENET Men's Campaign - A Quiet Luxury"
                fill
                className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-white relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-neutral-100" />
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-neutral-400 mb-6 block">
                Men's Collection
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] dark:text-[#F4F1ED] leading-[1.1] mb-8">
                A Quiet Luxury <br />Design Language
              </h2>
              <div className="prose prose-neutral prose-lg">
                <p className="font-sans text-neutral-600 leading-relaxed mb-6">
                  Spun from multi-generational weavers, our classic collections feature structured cable-knit sweaters, breathable linen popovers, and tailored Gurkha trousers designed to endure across seasons.
                </p>
                <p className="font-sans text-neutral-600 leading-relaxed mb-8">
                  We believe in a wardrobe that speaks in whispers rather than shouts. Clean silhouettes, premium organic threads, and absolute modularity allow for seamless transitions from the boardroom to the coastline. Every stitch is a testament to uncompromised quality.
                </p>
              </div>
              <div>
                <Link
                  href="/#new-arrivals"
                  className="inline-block group/btn px-8 py-4 border border-black text-black hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 tracking-[0.2em] text-xs font-bold uppercase backdrop-blur-sm relative overflow-hidden"
                >
                  Shop Men's Edit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Women's Campaign Section */}
        <section className="mb-12">
          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col lg:flex-row-reverse items-stretch group">
            <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[600px] overflow-hidden">
              <Image
                src="/images/editorial_campaign_women.webp"
                alt="TENET Women's Campaign - An Effortless Elegance"
                fill
                className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-white relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-neutral-100" />
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-neutral-400 mb-6 block">
                Women's Collection
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] dark:text-[#F4F1ED] leading-[1.1] mb-8">
                An Effortless <br />Elegance & Grace
              </h2>
              <div className="prose prose-neutral prose-lg">
                <p className="font-sans text-neutral-600 leading-relaxed mb-6">
                  Meticulously sculpted from Italian wool-cashmere yarns, our classic collections feature fine rib-knit sweaters, elegant unstructured coats, and modular linen popovers designed for effortless grace across seasons.
                </p>
                <p className="font-sans text-neutral-600 leading-relaxed mb-8">
                  Our design ethos embraces the natural fluidity of premium fabrics, ensuring absolute comfort without sacrificing structural integrity. The result is a curated selection of timeless silhouettes that move with you, embodying modular simplicity for the modern woman.
                </p>
              </div>
              <div>
                <Link
                  href="/#new-arrivals"
                  className="inline-block group/btn px-8 py-4 border border-black text-black hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 tracking-[0.2em] text-xs font-bold uppercase backdrop-blur-sm relative overflow-hidden"
                >
                  Shop Women's Edit
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* SEO Hidden Text (Optional: Adds more semantic value for crawlers) */}
        <div className="sr-only">
          <h2>About TENET Fashion</h2>
          <p>TENET is a premium clothing brand specializing in luxury essentials. Our editorial campaigns showcase our commitment to sustainable fashion, using organic materials and Italian craftsmanship to create versatile clothing for men and women.</p>
        </div>
      </div>
    </main>
  );
}
