"use client";

import { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GalleryItem } from "@/lib/types";

const categories = ["All", "Commercial", "Residential", "Outdoor", "Industrial"];

const heights = [
  "h-64", "h-80", "h-56", "h-72", "h-64", "h-80",
  "h-72", "h-64", "h-80", "h-56", "h-64", "h-72",
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (err) {
      console.error("Failed to fetch gallery items from API:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            Gallery
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our Projects & Installations
          </h1>
          <p className="text-gray-300 max-w-xl font-light">
            Browse our portfolio of completed lighting projects across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                activeCategory === cat
                  ? "bg-brand-primary text-brand-dark font-bold shadow-gold-glow"
                  : "bg-brand-charcoal text-brand-text border border-brand-border hover:border-gold/40 hover:text-gold"
              )}
            >
              {cat}
              <span className="ml-1.5 text-xs opacity-70">
                ({cat === "All"
                  ? galleryItems.length
                  : galleryItems.filter((i) => i.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Masonry-style grid (3-col CSS columns) */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl overflow-hidden bg-brand-charcoal border border-brand-border animate-pulse"
              >
                <div className={cn("skeleton", heights[i % heights.length])} />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded-full skeleton" />
                  <div className="h-3 w-full rounded-full skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer bg-brand-charcoal border border-brand-border hover:border-brand-primary hover:shadow-card-hover transition-all duration-300"
                onClick={() => setLightboxIndex(idx)}
              >
                <div className={cn("relative overflow-hidden", heights[idx % heights.length])}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn size={22} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-brand-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-brand-text">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-brand-text mb-4">Want to see full project case studies?</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
          >
            View Case Studies
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors text-lg font-bold"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              className="max-w-full max-h-[75vh] rounded-2xl object-contain mx-auto"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold text-lg">{lightboxItem.title}</h3>
              {lightboxItem.description && (
                <p className="text-gray-400 text-sm mt-1">{lightboxItem.description}</p>
              )}
              <p className="text-gold/70 text-xs mt-1">
                {lightboxIndex! + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors text-lg font-bold"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
