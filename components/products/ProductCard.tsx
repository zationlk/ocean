"use client";

import Link from "next/link";
import { MessageCircle, Heart, GitCompare, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import QuickView from "@/components/ui/QuickView";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  shortDescription?: string;
  short_description?: string;
  images: string[];
  specifications?: Record<string, string>;
  features?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  badge?: string;
}

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-500 group-hover/wa:fill-white transition-colors" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ProductCard({ product }: { product: Product }) {
  const { add, remove, isInWishlist } = useWishlist();
  const { add: addCompare, remove: removeCompare, isInCompare, items: compareItems } = useCompare();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare  = isInCompare(product.id);

  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}". Could you please provide more details?`
  );

  const shortDesc    = product.shortDescription || product.short_description || product.description || "";
  const displayImage = product.images?.[0] || "/placeholder-product.jpg";
  const isNew        = product.isNew || product.is_new;
  const badge        = product.badge;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    inWishlist ? remove(product.id) : add({ id: product.id, name: product.name, slug: product.slug, image: displayImage, category: product.category });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inCompare) {
      removeCompare(product.id);
    } else if (compareItems.length < 3) {
      addCompare({ id: product.id, name: product.name, slug: product.slug, image: displayImage, category: product.category, specifications: product.specifications, features: product.features, shortDescription: product.shortDescription || product.short_description });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      {/* QuickView rendered via portal into document.body */}
      <QuickView
        product={quickViewOpen ? (product as Parameters<typeof QuickView>[0]["product"]) : null}
        onClose={() => setQuickViewOpen(false)}
      />

      <div className="group bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden product-card hover:border-gold/40 hover:shadow-gold-glow transition-all duration-300">
        {/* ── Image ── */}
        <div className="relative h-52 overflow-hidden bg-brand-obsidian">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          {(badge || isNew) && (
            <div className="absolute top-3 left-3 z-10">
              {badge ? (
                <span className="bg-gold text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {badge}
                </span>
              ) : (
                <span className="bg-brand-primary text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  New
                </span>
              )}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-brand-charcoal/80 hover:bg-brand-charcoal text-white/60 hover:text-red-400 border border-brand-border"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={13} className={inWishlist ? "fill-white" : ""} />
          </button>

          {/* Compare (appears on hover) */}
          <button
            onClick={handleCompare}
            title={compareItems.length >= 3 && !inCompare ? "Max 3 products" : inCompare ? "Remove from compare" : "Add to compare"}
            className={cn(
              "absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm opacity-0 group-hover:opacity-100",
              inCompare
                ? "bg-gold text-brand-dark"
                : compareItems.length >= 3
                ? "bg-brand-obsidian text-white/20 cursor-not-allowed border border-brand-border"
                : "bg-brand-charcoal/80 hover:bg-brand-charcoal text-white/60 hover:text-gold border border-brand-border"
            )}
            aria-label="Compare"
          >
            <GitCompare size={12} />
          </button>

          {/* Hover overlay — Quick View + WhatsApp only, NO eye icon */}
          <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-0">
            <button
              onClick={handleQuickView}
              className="flex items-center gap-1.5 bg-brand-charcoal/90 hover:bg-gold hover:text-brand-dark border border-brand-border/50 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-lg"
              title="Quick view"
            >
              <Maximize2 size={13} /> Quick View
            </button>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
              aria-label="Inquire on WhatsApp"
              onClick={e => e.stopPropagation()}
            >
              <MessageCircle size={15} className="text-white" />
            </a>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4">
          <div className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1.5">
            {product.category?.replace(/-/g, " ")}
          </div>

          <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-gold transition-colors leading-snug">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-[11px] text-brand-text font-light line-clamp-2 mb-4 leading-relaxed">{shortDesc}</p>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 text-center bg-gold/10 hover:bg-gold text-gold hover:text-brand-dark text-xs font-bold py-2.5 rounded-lg transition-all duration-200 border border-gold/15 hover:border-gold hover:shadow-gold-glow"
            >
              View Details
            </Link>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-green-500/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors group/wa border border-green-500/15 hover:border-green-500"
              aria-label="Inquire on WhatsApp"
            >
              {WA_SVG}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
