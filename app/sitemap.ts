import { MetadataRoute } from 'next'
import { getProducts, getCollections } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tenetarchives.com'

  try {
    // Fetch all products and collections
    const [products, collections] = await Promise.all([
      getProducts(),
      getCollections()
    ])

    // Generate URLs for products
    const productUrls = products.map((product: { handle: string }) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Generate URLs for collections
    const collectionUrls = collections.map((collection: { handle: string }) => ({
      url: `${baseUrl}/collection/${collection.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Static routes
    const staticRoutes = [
      '',
      '/privacy-policy',
      '/terms-and-conditions'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.5,
    }))

    return [...staticRoutes, ...collectionUrls, ...productUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to just static routes if Sanity fetch fails
    const staticRoutes = [
      '',
      '/privacy-policy',
      '/terms-and-conditions'
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.5,
    }))

    return staticRoutes
  }
}
