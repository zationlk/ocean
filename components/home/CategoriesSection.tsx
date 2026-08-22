"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { categories, products } from "@/lib/data";

const LIGHTING_SLUGS = [
  "indoor-lighting", "outdoor-lighting", "commercial-lighting",
  "led-bulbs", "led-tube-lights", "led-ceiling-lights",
  "led-strip-lighting", "led-mirror-lights", "led-step-lights", "electrical-items",
];

function CategoryCard({ category, count, small = false }: {
  category: { id: string; slug: string; image: string; icon: string; name: string; description: string };
  count: number;
  small?: boolean;
}) {
  // Route lighting slugs to /lighting, bathware slugs to /bathware
  const isLighting = LIGHTING_SLUGS.includes(category.slug);
  const href = isLighting
    ? `/lighting?category=${category.slug}`
    : `/bathware?category=${category.slug}`;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-brand-charcoal border border-brand-border hover:border-gold/50 transition-all duration-300 hover:shadow-gold-glow flex flex-col"
    >
      <div className={`relative overflow-hidden ${small ? "h-32" : "h-40"}`}>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-base border border-white/10">
          {category.icon}
        </div>
        {count > 0 && (
          <div className="absolute bottom-2 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
            {count} item{count !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-semibold text-sm text-white mb-1 group-hover:text-gold transition-colors leading-snug">
          {category.name}
        </h4>
        <p className="text-[11px] text-brand-text font-light leading-relaxed line-clamp-2 mb-3 flex-1">
          {category.description}
        </p>
        <div className="flex items-center gap-1 text-gold font-bold text-[10px] uppercase tracking-wider">
          Browse <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function CategoriesSection() {
  const countMap: Record<string, number> = {};
  products.forEach((p) => {
    countMap[p.category] = (countMap[p.category] || 0) + 1;
  });

  const lightingCategories = categories.filter(c => LIGHTING_SLUGS.includes(c.slug));
  const bathwareCategories = categories.filter(c => !LIGHTING_SLUGS.includes(c.slug));

  return (
    <section className="section-padding bg-brand-bg relative">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
            <Sparkles size={12} />
            Our Collections
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            Explore Our Product Range
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p className="text-brand-text max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
            From energy-efficient LED lighting to premium bathware — everything you need for your home, hotel or commercial space.
          </p>
        </div>

        <div className="space-y-14">
          {/* ── Lighting & Electrical ── */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                  Lighting & Electrical
                </h3>
              </div>
              <Link
                href="/lighting"
                className="hidden sm:flex items-center gap-1.5 text-xs text-gold font-bold uppercase tracking-wider hover:gap-2.5 transition-all"
              >
                All Lighting <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {lightingCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} count={countMap[cat.slug] || 0} small />
              ))}
            </div>
          </div>

          {/* ── Bathware & Plumbing ── */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚿</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                  Bathware & Plumbing
                </h3>
              </div>
              <Link
                href="/bathware"
                className="hidden sm:flex items-center gap-1.5 text-xs text-gold font-bold uppercase tracking-wider hover:gap-2.5 transition-all"
              >
                All Bathware <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-5">
              {bathwareCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} count={countMap[cat.slug] || 0} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/lighting"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
          >
            View Complete Catalog
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
