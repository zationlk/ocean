"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"all" | "lighting" | "bathware">("all");

  // Get all featured products
  const featuredProducts = staticProducts.filter((p) => p.isFeatured);

  // Filter based on active tab
  const filteredProducts = featuredProducts.filter((product) => {
    if (activeTab === "all") return true;
    const isLighting = product.category.startsWith("led-");
    if (activeTab === "lighting") return isLighting;
    if (activeTab === "bathware") return !isLighting;
    return true;
  });

  const tabs = [
    { id: "all", label: "All Masterpieces" },
    { id: "lighting", label: "Designer Lighting" },
    { id: "bathware", label: "Luxury Bathware" },
  ] as const;

  return (
    <section className="section-padding bg-brand-obsidian relative">
      <div className="container-custom">
        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-brand-primary text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 shadow-sm border border-gold/20">
              <Sparkles size={12} className="text-gold" />
              <span>Elite Showcases</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-wide">
              Our Curated Best Sellers
            </h2>
            <div className="section-divider" />
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all duration-200 shrink-0 text-sm tracking-wider uppercase"
          >
            Explore Full Catalog
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center md:justify-start gap-2 mb-10 border-b border-brand-border pb-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-brand-dark bg-gold shadow-gold-glow"
                  : "text-gray-300 hover:text-gold hover:bg-gold/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid with Framer Motion Animation */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-text font-light text-lg">No featured masterpieces in this collection yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}