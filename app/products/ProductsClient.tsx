"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Grid, List } from "lucide-react";
import { products as staticProducts, categories as staticCategories } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use static data directly
  const products = staticProducts;
  const categories = staticCategories;

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.shortDescription?.toLowerCase().includes(query);
        const catMatch = p.category?.toLowerCase().includes(query);
        return nameMatch || descMatch || catMatch;
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const categoryOptions = [
    { value: "all", label: "All Products" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-hero-gradient text-white py-20 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4.5 py-1.5 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
            Signature Catalog
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-wide">
            Our Masterpiece Collections
          </h1>
          <p className="text-gray-300 max-w-2xl font-light text-sm md:text-base leading-relaxed">
            Explore our curated ranges of high-efficiency LED lighting solutions and luxury imported designer bathware suites.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-5 mb-8 flex flex-col lg:flex-row gap-5 items-start lg:items-center shadow-sm">
          <div className="relative flex-1 max-w-md w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-brand-border bg-brand-obsidian text-white rounded-xl text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
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

          <div className="flex flex-wrap gap-2 flex-1 w-full overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0",
                  selectedCategory === cat.value
                    ? "bg-gold text-brand-dark shadow-gold-glow"
                    : "bg-brand-obsidian text-gray-300 border border-brand-border hover:bg-gold/10 hover:text-gold"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-brand-obsidian rounded-xl p-1 shrink-0 border border-brand-border">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid" ? "bg-brand-charcoal shadow-sm text-gold" : "text-gray-400"
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "list" ? "bg-brand-charcoal shadow-sm text-gold" : "text-gray-400"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-brand-text font-medium">
          Showing <span className="text-gold font-bold">{filteredProducts.length}</span> products
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-brand-charcoal rounded-2xl border border-brand-border">
            <Package size={40} className="mx-auto mb-3 text-brand-text/20" />
            <p className="text-brand-text text-lg font-light">No products found matching your filters.</p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-4 text-gold hover:underline font-semibold text-sm"
            >
              Reset Filters
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
  );
}