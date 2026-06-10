import { createSupabaseClient } from '@/lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://www.oceanlighting.lk'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.5 },
  ]

  try {
    const supabase = createSupabaseClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .limit(100)

    if (products) {
      const productUrls = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at || new Date()),
        priority: 0.7,
      }))

      return [...staticPages, ...productUrls]
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return staticPages
}