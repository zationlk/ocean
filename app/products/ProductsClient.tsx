"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X, Grid, List } from "lucide-react"
import { products as staticProducts, categories as staticCategories } from "@/lib/data"
import ProductCard from "@/components/products/ProductCard"
import { cn } from "@/lib/utils"

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Use static data directly
  const products = staticProducts
  const categories = staticCategories

  const filteredProducts = useMemo(() => {
    let result = products

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query)
        const descMatch = p.shortDescription?.toLowerCase().includes(query)
        const catMatch = p.category?.toLowerCase().includes(query)
        return nameMatch || descMatch || catMatch
      })
    }

    return result
  }, [products, selectedCategory, searchQuery])

  const categoryOptions = [
    { value: "all", label: "All Products" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ]

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            Products
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our Product Collection
          </h1>
          <p className="text-teal-200 max-w-2xl">
            Explore our comprehensive range of premium LED lighting, electrical items, and interior solutions.
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="bg-white rounded-2xl border border-brand-border p-5 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 flex-1">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  selectedCategory === cat.value
                    ? "bg-brand-primary text-white shadow-teal-glow"
                    : "bg-brand-bg text-brand-text hover:bg-teal-50 hover:text-brand-primary"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-brand-bg rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-400"
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-400"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="mb-4 text-sm text-brand-text">
          Showing {filteredProducts.length} products
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-text text-lg">No products found.</p>
            <button
              onClick={() => {
                setSelectedCategory("all")
                setSearchQuery("")
              }}
              className="mt-4 text-brand-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}