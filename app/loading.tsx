export default function Loading() {
    return (
        <main className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen animate-pulse">
            {/* Hero Banner Skeleton */}
            <div className="w-full h-[55vh] md:h-[75vh] bg-neutral-200 relative overflow-hidden flex items-center justify-center">
                <div className="w-24 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Category Grid Section Skeleton */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="w-48 h-8 bg-neutral-200 mx-auto mb-8 md:mb-12 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-neutral-200" />
                            <div className="w-16 h-4 bg-neutral-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Section Grid Skeleton */}
            <div className="max-w-[2000px] w-full mx-auto px-4 md:px-6 xl:px-12 py-12 border-t border-neutral-100">
                <div className="w-64 h-8 bg-neutral-200 mb-8 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-full aspect-[3/4] bg-neutral-200 rounded-lg" />
                            <div className="w-3/4 h-4 bg-neutral-200 rounded" />
                            <div className="w-1/2 h-4 bg-neutral-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
