"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { categories, products } from "@/lib/data";

export default function CategoriesSection() {
  // Compute product count per category
  const countMap: Record<string, number> = {};
  products.forEach((p) => {
    countMap[p.category] = (countMap[p.category] || 0) + 1;
  });

  const lightingCategories = categories.filter(c => c.slug.startsWith("led-"));
  const bathwareCategories = categories.filter(c => !c.slug.startsWith("led-"));

  return (
    <section className="section-padding bg-brand-bg relative">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-brand-primary text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 shadow-sm border border-gold/20">
            <Sparkles size={12} className="text-gold" />
            <span>Exquisite Ranges</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide">
            Explore Our Designer Collections
          </h2>
          <div className="section-divider mx-auto mb-5" />
          <p className="text-brand-text max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
            From smart energy-efficient LED layouts to opulent bath suites, discover premium elements curated for exceptional architecture.
          </p>
        </div>

        {/* Dual Section Split */}
        <div className="space-y-16">
          
          {/* Lighting Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-brand-border pb-3">
              <span className="text-2xl">💡</span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                Architectural & Ambient Lighting
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {lightingCategories.map((category, index) => {
                const count = countMap[category.slug] || 0;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group relative block overflow-hidden rounded-2xl bg-brand-charcoal border border-brand-border hover:border-gold/50 transition-all duration-300 shadow-sm hover:shadow-gold-glow"
                  >
                    <div className="grid sm:grid-cols-12 h-full">
                      {/* Image side */}
                      <div className="relative sm:col-span-5 h-48 sm:h-full overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                      </div>
                      {/* Content side */}
                      <div className="p-6 sm:col-span-7 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{category.icon}</span>
                            {count > 0 && (
                              <span className="bg-gold/10 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-gold/20">
                                {count} Items
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-gold transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-xs text-brand-text leading-relaxed font-light mb-4">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-gold font-bold text-xs uppercase tracking-wider mt-auto">
                          <span>Browse Collection</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bathware Section */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-brand-border pb-3">
              <span className="text-2xl">🚿</span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                Bespoke & Luxury Bathware
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bathwareCategories.map((category, index) => {
                const count = countMap[category.slug] || 0;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-brand-charcoal border border-brand-border hover:border-gold/50 transition-all duration-300 shadow-sm hover:shadow-gold-glow flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />

                      {/* Icon */}
                      <div className="absolute top-3 right-3 w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-xl border border-white/5">
                        {category.icon}
                      </div>

                      {/* Product count badge */}
                      {count > 0 && (
                        <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/5">
                          {count} item{count !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-display font-semibold text-base text-white mb-2 group-hover:text-gold transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-xs text-brand-text font-light leading-relaxed mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-gold font-bold text-xs uppercase tracking-wider mt-auto">
                        <span>Browse</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* View all link */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-dark text-white hover:bg-gold hover:text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-md"
          >
            Explore Complete Catalog
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}