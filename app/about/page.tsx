"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const pillars = [
        {
            title: "Silent Luxury",
            description: "We believe garments should speak through their texture, drape, and structural perfection rather than loud logos. True sophistication is understated."
        },
        {
            title: "Artisanal Integrity",
            description: "Collaborating with local and global multi-generational weavers, our materials are selected for their longevity, handfeel, and heritage value."
        },
        {
            title: "Timeless Curation",
            description: "Rejecting fast fashion trend cycles, we design structured silhouettes meant to build a modular, evergreen archive of personal style."
        }
    ];

    return (
        <main className="bg-[#FDFBF7] min-h-screen pb-24 text-[#1A1A1A]">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-32 md:py-48 px-6 border-b border-neutral-100 bg-white">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 0.6, letterSpacing: "0.2em" }}
                        transition={{ duration: 0.8 }}
                        className="text-[10px] font-bold uppercase tracking-widest block mb-4"
                    >
                        Our Philosophy
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-serif text-4xl md:text-6xl text-[#1A1A1A] mb-8 leading-tight"
                    >
                        Heritage in Every Thread,<br />Innovation in Every Fit
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="font-sans text-neutral-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        TENET Archives was founded on a singular premise: to redefine luxury clothing for the modern individual through artisanal quality, clean silhouettes, and absolute comfort.
                    </motion.p>
                </div>
                {/* Decorative visual elements */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
            </div>

            {/* Content & Story */}
            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-neutral-600 leading-relaxed font-sans text-base md:text-lg"
                    >
                        <h2 className="font-serif text-3xl text-black mb-4">The TENET Standard</h2>
                        <p>
                            Every collection we design is a study in texture. From breathable premium Italian linen popovers to structured wool trousers and Japanese pique knits, we focus on fabrics that adapt gracefully to both tropical humidity and cool evenings.
                        </p>
                        <p>
                            By optimizing our supply chain and sourcing directly from ethical mills, we bypass traditional wholesale markups to deliver true bespoke-level tailoring at accessible premium price points.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white p-8 md:p-12 border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6"
                    >
                        <div className="border-l-2 border-black pl-4">
                            <span className="font-serif italic text-lg text-neutral-500 block mb-2">"True quiet luxury is defined by the confidence of detail."</span>
                            <span className="text-xs uppercase font-bold tracking-widest">— Design Team, TENET</span>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Each garment undergoes intensive fit testing and wash cycles before release, ensuring that standard Indian sizing matrices are catered to precisely, eliminating typical armhole binding or waist mismatches.
                        </p>
                    </motion.div>
                </div>

                {/* Three Pillars Grid */}
                <div className="border-t border-neutral-100 pt-20">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl mb-4">Our Core Pillars</h2>
                        <p className="font-sans text-neutral-400 text-sm">The principles that guide our design and development cycle.</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {pillars.map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="bg-white border border-neutral-100 p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="font-serif text-xl block mb-3 text-black font-semibold">{pillar.title}</span>
                                <p className="font-sans text-neutral-500 text-sm leading-relaxed">{pillar.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
