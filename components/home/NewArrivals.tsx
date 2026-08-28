"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  if (loading) {
    return (
      <section className="section-padding bg-brand-bg">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="w-36 h-8 rounded-full skeleton mb-4" />
              <div className="w-64 h-10 rounded-full skeleton mb-3" />
              <div className="w-16 h-1 skeleton" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden animate-pulse">
                <div className="h-56 bg-brand-bg skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 rounded-full skeleton" />
                  <div className="h-4 w-full rounded-full skeleton" />
                  <div className="h-4 w-3/4 rounded-full skeleton" />
                  <div className="h-3 w-full rounded-full skeleton" />
                  <div className="h-3 w-2/3 rounded-full skeleton" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-9 flex-1 rounded-lg skeleton" />
                    <div className="h-9 w-9 rounded-lg skeleton" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (newProducts.length === 0) return null;

  return (
    <section className="section-padding bg-brand-bg">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
              <Sparkles size={12} className="text-gold" />
              New Arrivals
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
              Just Landed
            </h2>
            <div className="section-divider" />
          </div>
          <Link href="/lighting" className="inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all duration-200 shrink-0 text-sm tracking-wider uppercase">
            View All New <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
