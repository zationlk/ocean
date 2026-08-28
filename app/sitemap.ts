import { query } from "@/lib/mysql"

export const dynamic = "force-dynamic"

export default async function sitemap() {
  const baseUrl = "https://www.oceanlighting.lk"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lighting`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/bathware`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  try {
    const products = (await query("SELECT slug, updated_at FROM products LIMIT 500")) as any[]
    const categories = (await query("SELECT slug, updated_at FROM categories LIMIT 100")) as any[]

    const productUrls = Array.isArray(products)
      ? products.map((product) => ({
          url: `${baseUrl}/products/${product.slug}`,
          lastModified: new Date(product.updated_at || new Date()),
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      : []

    const categoryUrls = Array.isArray(categories)
      ? categories.map((category) => ({
          url: `${baseUrl}/products?category=${category.slug}`,
          lastModified: new Date(category.updated_at || new Date()),
          changeFrequency: "weekly",
          priority: 0.7,
        }))
      : []

    return [...staticPages, ...categoryUrls, ...productUrls]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticPages
  }
}