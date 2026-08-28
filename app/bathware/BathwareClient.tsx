"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Grid, List, Droplets } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Category, Product } from "@/lib/types";

const BATHWARE_SLUGS = [
  "toilets","wash-basins","faucets-mixers","showers",
  "bathroom-accessories","bathroom-mirrors","vanity-units",
  "kitchen-sinks-faucets","plumbing-accessories",
];

export default function BathwareClient() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(
    BATHWARE_SLUGS.includes(initial) ? initial : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode]       = useState<"grid"|"list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);
        const [catData, prodData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
        ]);
        setCategories(Array.isArray(catData) ? catData : (catData.data || []));
        setProducts(Array.isArray(prodData) ? prodData : (prodData.data || []));
      } catch (error) {
        console.error("Failed to load categories or products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const bathwareCategories = useMemo(
    () => categories.filter(c => BATHWARE_SLUGS.includes(c.slug)),
    [categories]
  );

  const bathwareProducts = useMemo(
    () => products.filter(p => BATHWARE_SLUGS.includes(p.category)),
    [products]
  );

  const filtered = useMemo(() => {
    let r = bathwareProducts;
    if (selectedCategory !== "all") r = r.filter(p => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription || "").toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return r;
  }, [bathwareProducts, selectedCategory, searchQuery]);

  const categoryOptions = [
    { value:"all", label:"All Bathware", icon:"🚿", count: bathwareProducts.length },
    ...bathwareCategories.map(c => ({
      value: c.slug, label: c.name, icon: c.icon,
      count: bathwareProducts.filter(p => p.category === c.slug).length,
    })),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="bg-hero-gradient text-white py-16 relative overflow-hidden border-b border-gold/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/8 blur-[120px]" />
          </div>
          <div className="container-custom relative z-10">
            <div className="w-48 h-4 rounded-full skeleton mb-4" />
            <div className="w-80 h-12 rounded-full skeleton mb-3" />
            <div className="w-96 h-5 rounded-full skeleton mb-8" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-24 h-8 rounded-full skeleton" />
              ))}
            </div>
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm w-full h-11 rounded-xl skeleton" />
            <div className="w-32 h-8 rounded-xl skeleton ml-auto" />
          </div>
          <SkeletonGrid count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-16 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/8 blur-[120px]" />
        </div>
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-2 text-gold/60 text-xs font-semibold uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Bathware & Plumbing</span>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
                <Droplets size={12} /> Bathware & Plumbing
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 tracking-wide">
                Bathware & Plumbing
              </h1>
              <p className="text-brand-text font-light max-w-xl text-sm md:text-base leading-relaxed">
                9 categories — toilets, basins, faucets, showers, mirrors, vanity units, kitchen sinks and more.
              </p>
            </div>
            <Link
              href="/lighting"
              className="hidden md:flex items-center gap-2 shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
            >
              View Lighting →
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {categoryOptions.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  selectedCategory === cat.value
                    ? "bg-gold text-brand-dark border-gold shadow-gold-glow"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span className={cn("text-[10px] font-normal", selectedCategory === cat.value ? "text-brand-dark/70" : "text-white/40")}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
            <input
              type="text"
              placeholder="Search bathware products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-brand-charcoal text-white border border-brand-border rounded-xl text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all placeholder:text-brand-text/30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text/40 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-brand-text/60 text-sm">
              <span className="text-gold font-bold">{filtered.length}</span> products
            </span>
            <div className="flex items-center gap-1 bg-brand-charcoal rounded-xl p-1 border border-brand-border">
              <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode==="grid" ? "bg-brand-bg text-gold" : "text-brand-text/40")}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode==="list" ? "bg-brand-bg text-gold" : "text-brand-text/40")}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-brand-charcoal rounded-2xl border border-brand-border">
            <Droplets size={36} className="mx-auto mb-3 text-brand-text/20" />
            <p className="text-white font-semibold mb-2">No products found</p>
            <button onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }} className="text-gold text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-5",
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            {filtered.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
