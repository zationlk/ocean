"use client";

import { Sparkles } from "lucide-react";

const brands = [
  "TOTO", "Grohe", "Kohler", "Roca", "Philips",
  "Osram", "Jaquar", "Panasonic", "Havells", "Wipro", "Crompton", "Bajaj",
];

const marqueeItems = [...brands, ...brands, ...brands];

export default function BrandsSection() {
  return (
    <section className="py-16 bg-brand-obsidian border-y border-brand-border overflow-hidden">
      <div className="container-custom mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-gold/20">
          <Sparkles size={12} />
          Our Partners
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">
          World-Class Brands, Exclusively Curated
        </h2>
        <div className="w-16 h-px bg-gold mx-auto" />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-obsidian to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-obsidian to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="shrink-0 flex items-center justify-center h-12 px-7 rounded-xl border border-brand-border bg-brand-charcoal hover:border-gold/50 transition-all duration-300 group cursor-default"
            >
              <span className="font-display font-bold text-sm text-brand-text/50 group-hover:text-white transition-colors duration-300 whitespace-nowrap tracking-widest uppercase">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-brand-text/40 mt-8 font-light tracking-wide">
        + many more international brands available in-store
      </p>
    </section>
  );
}
