import { Loader2 } from "lucide-react";

export default function ProductLoading() {
    return (
        <main className="bg-[#FDFBF7] min-h-screen pb-20 animate-pulse">
            <div className="max-w-[2000px] w-full mx-auto px-0 md:px-6 xl:px-12 pt-0 md:pt-14 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 lg:gap-24">
                
                {/* Left Column: Gallery Skeleton */}
                <div className="hidden md:flex gap-6 h-fit">
                    {/* Thumbnails Skeleton */}
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-20 h-24 bg-neutral-200" />
                        ))}
                    </div>
                    {/* Main Image Skeleton */}
                    <div className="relative flex-1 aspect-[3/4] bg-neutral-200 overflow-hidden flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
                    </div>
                </div>

                {/* Mobile Gallery Skeleton */}
                <div className="block md:hidden relative w-full aspect-[3/4] bg-neutral-200 mb-6 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
                </div>

                {/* Right Column: Details Skeleton */}
                <div className="flex flex-col pt-4 px-4 md:px-0">
                    <div className="w-20 h-3 bg-neutral-200 mb-4" /> {/* Category */}
                    <div className="w-3/4 h-10 md:h-14 bg-neutral-200 mb-4" /> {/* Title */}
                    <div className="w-32 h-6 bg-neutral-200 mb-8" /> {/* Price */}

                    {/* Color Skeleton */}
                    <div className="mb-8 mt-4">
                        <div className="w-16 h-3 bg-neutral-200 mb-3" />
                        <div className="flex gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-neutral-200" />
                            ))}
                        </div>
                    </div>

                    {/* Size Skeleton */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-3">
                            <div className="w-12 h-3 bg-neutral-200" />
                            <div className="w-20 h-3 bg-neutral-200" />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {['S', 'M', 'L', 'XL'].map((i) => (
                                <div key={i} className="w-12 h-12 bg-neutral-200" />
                            ))}
                        </div>
                    </div>

                    {/* Buttons Skeleton */}
                    <div className="flex gap-3 mb-10">
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="w-full h-14 bg-neutral-200" />
                            <div className="w-full h-14 bg-[#E5E5E5]" />
                        </div>
                        <div className="w-[60px] h-auto bg-neutral-200" />
                    </div>
                    
                    {/* Accordion Skeletons */}
                    <div className="border-t border-neutral-200 pt-8">
                        <div className="w-full h-4 bg-neutral-200 mb-6" />
                        <div className="w-full h-4 bg-neutral-200 mb-6" />
                        <div className="w-full h-4 bg-neutral-200 mb-6" />
                    </div>
                </div>
            </div>
            
            {/* Recommended Products Skeleton */}
            <div className="max-w-[2000px] w-full mx-auto px-4 md:px-6 xl:px-12 mt-20 md:mt-32 border-t border-neutral-200 pt-16">
                 <div className="w-48 h-8 bg-neutral-200 mx-auto mb-12" />
                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-10 lg:gap-y-16">
                     {[1, 2, 3, 4, 5].map((i) => (
                         <div key={i}>
                             <div className="w-full aspect-[3/4] bg-neutral-200 mb-4" />
                             <div className="w-3/4 h-4 bg-neutral-200 mb-2" />
                             <div className="w-1/2 h-3 bg-neutral-200" />
                         </div>
                     ))}
                 </div>
            </div>
        </main>
    );
}
