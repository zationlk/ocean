import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { products as staticProducts } from "@/lib/data"
import ProductCard from "@/components/products/ProductCard"

export default function FeaturedProducts() {
  // Use static data directly - works without Supabase
  const featuredProducts = staticProducts.filter((p) => p.isFeatured).slice(0, 6)

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Featured Products
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Best Sellers
            </h2>
            <div className="section-divider" />
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-brand-primary font-semibold hover:gap-3 transition-all duration-200 shrink-0"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}