import { query } from "@/lib/mysql"

export const revalidate = 3600; // Regenerate sitemap every hour

const LIGHTING_SLUGS = new Set([
  "indoor-lighting", "outdoor-lighting", "commercial-lighting",
  "led-bulbs", "led-tube-lights", "led-ceiling-lights",
  "led-strip-lighting", "led-mirror-lights", "led-step-lights", "electrical-items",
]);

export default async function sitemap() {
  const baseUrl = "https://www.oceanlighting.lk"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
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

    // Map categories to the correct catalogue URL (/lighting or /bathware)
    const categoryUrls = Array.isArray(categories)
      ? categories.map((category) => {
          const base = LIGHTING_SLUGS.has(category.slug) ? "lighting" : "bathware";
          return {
            url: `${baseUrl}/${base}?category=${category.slug}`,
            lastModified: new Date(category.updated_at || new Date()),
            changeFrequency: "weekly",
            priority: 0.7,
          };
        })
      : []

    return [...staticPages, ...categoryUrls, ...productUrls]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticPages
  }
}