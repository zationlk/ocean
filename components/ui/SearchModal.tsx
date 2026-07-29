"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { products, categories } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const matchedProducts = q.length < 2 ? [] : products
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.shortDescription || "").toLowerCase().includes(q)
    )
    .slice(0, 6);

  const matchedCategories = q.length < 2 ? [] : categories
    .filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
    .slice(0, 3);

  const hasResults = matchedProducts.length > 0 || matchedCategories.length > 0;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-brand-charcoal rounded-2xl border border-brand-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border">
          <Search size={20} className="text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-brand-text/40"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-brand-text/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-xs text-brand-text/40 bg-brand-obsidian border border-brand-border rounded px-2 py-1">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {q.length < 2 ? (
            /* Popular suggestions */
            <div className="p-5">
              <p className="text-xs font-semibold text-brand-text/50 uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["LED Panel", "Chandelier", "Rain Shower", "Bathtub", "Track Light", "Smart Mirror"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 bg-brand-obsidian hover:bg-gold/10 hover:text-gold text-brand-text text-sm rounded-lg border border-brand-border hover:border-gold/30 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center">
              <Sparkles size={32} className="text-brand-text/20 mx-auto mb-3" />
              <p className="text-brand-text font-medium">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-brand-text/50 text-sm mt-1">Try a different keyword</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {matchedCategories.length > 0 && (
                <>
                  <p className="px-3 py-2 text-xs font-semibold text-brand-text/50 uppercase tracking-wider">Categories</p>
                  {matchedCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gold/10 transition-colors group"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-gold">{cat.name}</div>
                        <div className="text-xs text-brand-text/60 truncate">{cat.description}</div>
                      </div>
                      <ArrowRight size={14} className="text-brand-text/30 group-hover:text-gold shrink-0" />
                    </Link>
                  ))}
                </>
              )}

              {matchedProducts.length > 0 && (
                <>
                  <p className="px-3 py-2 text-xs font-semibold text-brand-text/50 uppercase tracking-wider">
                    Products
                  </p>
                  {matchedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gold/10 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-brand-obsidian">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-gold truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-brand-text/60 capitalize">
                          {product.category.replace(/-/g, " ")}
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-brand-text/30 group-hover:text-gold shrink-0" />
                    </Link>
                  ))}
                </>
              )}

              {/* View all */}
              <div className="pt-2 px-3 pb-3">
                <Link
                  href={`/products`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold/10 hover:bg-gold text-gold hover:text-brand-dark font-semibold rounded-xl transition-all border border-gold/20 hover:border-gold text-sm"
                >
                  View all results
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
