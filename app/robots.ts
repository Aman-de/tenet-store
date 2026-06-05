import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tenetarchives.com';
    
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/studio/',       // Sanity Studio
                '/api/',          // API routes
                '/orders/',       // Customer orders
                '/cart',          // Shopping cart
                '/checkout',      // Checkout process
                '/search?*',      // Search queries (prevents thin/duplicate content indexing)
                '/*?sort=*',      // Sorted product listings
                '/*?filter=*',    // Filtered product listings
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
