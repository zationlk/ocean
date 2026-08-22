"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Droplets, Sparkles } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const LIGHTING_SLUGS = new Set([
  "indoor-lighting","outdoor-lighting","commercial-lighting",
  "led-bulbs","led-tube-lights","led-ceiling-lights",
  "led-strip-lighting","led-mirror-lights","led-step-lights","electrical-items",
]);

const tabs = [
  { id: "all",      label: "All",      Icon: Sparkles },
  { id: "lighting", label: "Lighting", Icon: Lightbulb },
  { id: "bathware", label: "Bathware", Icon: Droplets },
] as const;

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"all"|"lighting"|"bathware">("all");

  const featured = staticProducts.filter(p => p.isFeatured);
  const filtered = featured.filter(p => {
    if (activeTab === "all")      return true;
    if (activeTab === "lighting") return LIGHTING_SLUGS.has(p.category);
    if (activeTab === "bathware") return !LIGHTING_SLUGS.has(p.category);
    return true;
  });

  return (
    <section className="section-padding bg-brand-obsidian relative overflow-hidden">
      {/* bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/4 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
              <Sparkles size={11} className="text-gold" /> Featured
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
              Best Sellers
            </h2>
          </div>
          <Link href="/lighting" className="inline-flex items-center gap-2 text-gold font-bold text-sm tracking-wider uppercase hover:gap-3 transition-all shrink-0">
            Full Catalogue <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10">
          {tabs.map(({ id, label, Icon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                activeTab === id ? "text-brand-dark" : "text-brand-text/70 hover:text-gold hover:bg-gold/8"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="featured-tab-bg"
                  className="absolute inset-0 bg-gold rounded-xl shadow-gold-glow"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-brand-text/50 py-16 font-light">No featured products in this category yet.</p>
        )}
      </div>
    </section>
  );
}
