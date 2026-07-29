"use client";

import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { GitCompare, X, ArrowLeft, Check, Minus, MessageCircle } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function ComparePage() {
  const { items, remove, clear } = useCompare();

  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="bg-hero-gradient text-white py-16">
          <div className="container-custom">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
              <GitCompare size={14} />
              Compare Products
            </div>
            <h1 className="font-display text-4xl font-bold mb-2">Compare Products</h1>
            <p className="text-gray-300/80">Side-by-side product comparison</p>
          </div>
        </div>
        <div className="container-custom py-24 text-center">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
            <GitCompare size={40} className="text-brand-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Not enough products to compare
          </h2>
          <p className="text-brand-text mb-8 max-w-sm mx-auto">
            Add at least 2 products to the compare list by clicking the compare icon on any product card.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Collect all unique spec/feature keys
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specifications || {})))
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            <GitCompare size={14} />
            Compare Products
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">Compare Products</h1>
          <p className="text-gray-300/80">
            Comparing {items.length} products side by side
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand-text hover:text-brand-primary text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
          <button
            onClick={clear}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden">
          {/* Product headers */}
          <div
            className="grid border-b border-brand-border"
            style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
          >
            <div className="p-5 bg-brand-bg border-r border-brand-border">
              <span className="text-sm font-semibold text-brand-text uppercase tracking-wider">
                Products
              </span>
            </div>
            {items.map((item) => {
              const whatsappMsg = encodeURIComponent(
                `Hello! I'm interested in "${item.name}". Could you provide pricing?`
              );
              return (
                <div key={item.id} className="p-5 border-r border-brand-border last:border-r-0">
                  <div className="relative">
                    <button
                      onClick={() => remove(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <X size={12} />
                    </button>
                    <div className="h-40 rounded-xl overflow-hidden bg-brand-bg mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-brand-primary font-semibold uppercase tracking-wider mb-1">
                      {item.category.replace(/-/g, " ")}
                    </div>
                    <h3 className="font-semibold text-white mb-3 text-sm leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-text mb-4 line-clamp-2">
                      {item.shortDescription}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex-1 text-center text-xs bg-gold/10 hover:bg-brand-primary text-gold hover:text-brand-dark font-semibold py-2 rounded-lg transition-all"
                      >
                        View
                      </Link>
                      <a
                        href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                          className="w-8 h-8 bg-green-500/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors group/wa"
                      >
                        <MessageCircle size={13} className="text-green-600 group-hover/wa:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features row */}
          {items.some((i) => i.features && i.features.length > 0) && (
            <>
              <div
                className="grid bg-gold/10 border-b border-brand-border"
                style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
              >
                <div className="px-5 py-3 border-r border-brand-border">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Features
                  </span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-3 border-r border-brand-border last:border-r-0" />
                ))}
              </div>

              {/* Collect all unique features */}
              {Array.from(new Set(items.flatMap((i) => i.features || []))).map((feat) => (
                <div
                  key={feat}
                  className="grid border-b border-brand-border hover:bg-white/5 transition-colors"
                  style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
                >
                  <div className="px-5 py-3 border-r border-brand-border flex items-start">
                    <span className="text-sm text-brand-text">{feat}</span>
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="px-5 py-3 border-r border-brand-border last:border-r-0 flex items-center justify-center">
                      {(item.features || []).includes(feat) ? (
                        <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                          <Check size={13} className="text-brand-primary" />
                        </div>
                      ) : (
                        <Minus size={16} className="text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Specifications rows */}
          {allSpecKeys.length > 0 && (
            <>
              <div
                className="grid bg-gold/10 border-b border-brand-border"
                style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
              >
                <div className="px-5 py-3 border-r border-brand-border">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Specifications
                  </span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-3 border-r border-brand-border last:border-r-0" />
                ))}
              </div>

              {allSpecKeys.map((key) => (
                <div
                  key={key}
                  className="grid border-b border-brand-border hover:bg-white/5 transition-colors"
                  style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
                >
                  <div className="px-5 py-3 border-r border-brand-border">
                    <span className="text-sm font-medium text-white">{key}</span>
                  </div>
                  {items.map((item) => {
                    const val = item.specifications?.[key];
                    return (
                      <div
                        key={item.id}
                        className="px-5 py-3 border-r border-brand-border last:border-r-0"
                      >
                        {val ? (
                          <span className="text-sm text-brand-text">{val}</span>
                        ) : (
                          <Minus size={16} className="text-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
