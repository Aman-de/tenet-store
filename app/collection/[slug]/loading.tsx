export default function CollectionLoading() {
    return (
        <main className="bg-[#FDFBF7] min-h-screen pb-20 animate-pulse">
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
                {/* Title and Description Skeletons */}
                <div className="w-48 h-8 md:h-10 bg-neutral-200 mb-4 rounded" />
                <div className="w-3/4 max-w-lg h-4 bg-neutral-200 mb-8 rounded" />

                {/* Filter and Grid Skeleton */}
                <div className="flex gap-4 mb-8">
                    <div className="w-24 h-8 bg-neutral-200 rounded" />
                    <div className="w-24 h-8 bg-neutral-200 rounded" />
                </div>

                {/* Sorted Product Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-10 lg:gap-y-16">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-full aspect-[3/4] bg-neutral-200 rounded-lg" />
                            <div className="w-3/4 h-4 bg-neutral-200 rounded" />
                            <div className="w-1/2 h-4 bg-neutral-200 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
