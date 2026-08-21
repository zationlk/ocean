"use client";

import Link from "next/link";
import { MessageCircle, Heart, GitCompare, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
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
  const shortDesc  = product.shortDescription || product.short_description || product.description || "";
  const displayImage = product.images?.[0] || "/placeholder-product.jpg";
  const isNew = product.isNew || product.is_new;
  const badge = product.badge;

  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}". Could you please provide more details?`
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    inWishlist ? remove(product.id) : add({ id: product.id, name: product.name, slug: product.slug, image: displayImage, category: product.category });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inCompare) removeCompare(product.id);
    else if (compareItems.length < 3) addCompare({ id: product.id, name: product.name, slug: product.slug, image: displayImage, category: product.category, specifications: product.specifications, features: product.features, shortDescription: product.shortDescription || product.short_description });
  };

  return (
    <>
      <QuickView
        product={quickViewOpen ? (product as Parameters<typeof QuickView>[0]["product"]) : null}
        onClose={() => setQuickViewOpen(false)}
      />

      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden hover:border-gold/40 transition-colors duration-300"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
      >
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "inset 0 0 40px rgba(212,175,55,0.06)" }}
        />

        {/* ── Image ── */}
        <div className="relative overflow-hidden bg-brand-obsidian" style={{ aspectRatio: "4/3" }}>
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Gradient overlay always visible at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/60 via-transparent to-transparent" />

          {/* Badge */}
          {(badge || isNew) && (
            <div className="absolute top-3 left-3 z-10">
              <span className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm",
                badge ? "bg-gold text-brand-dark" : "bg-brand-primary text-brand-dark"
              )}>
                {badge || "New"}
              </span>
            </div>
          )}

          {/* Wishlist top-right */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md",
              inWishlist
                ? "bg-red-500 text-white border-red-500"
                : "bg-brand-obsidian/70 backdrop-blur-sm text-white/50 hover:text-red-400 border border-brand-border hover:border-red-400/50"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={13} className={inWishlist ? "fill-white" : ""} />
          </motion.button>

          {/* Compare bottom-right (hover) */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleCompare}
            title={compareItems.length >= 3 && !inCompare ? "Max 3 products" : inCompare ? "Remove" : "Compare"}
            className={cn(
              "absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm opacity-0 group-hover:opacity-100",
              inCompare ? "bg-gold text-brand-dark" : "bg-brand-obsidian/70 backdrop-blur-sm text-white/50 hover:text-gold border border-brand-border"
            )}
          >
            <GitCompare size={11} />
          </motion.button>

          {/* Centre overlay on hover: Quick View */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true); }}
              className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md hover:bg-gold hover:text-brand-dark border border-white/20 hover:border-gold text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-xl"
            >
              <Maximize2 size={12} /> Quick View
            </motion.button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4">
          {/* Category tag */}
          <div className="text-[9px] text-gold/70 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-gold/50 rounded-full inline-block" />
            {product.category?.replace(/-/g, " ")}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-gold transition-colors duration-200 leading-snug">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Short description */}
          <p className="text-[11px] text-brand-text/60 font-light line-clamp-2 mb-4 leading-relaxed">
            {shortDesc}
          </p>

          {/* Action row */}
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 text-center bg-gold/8 hover:bg-gold text-gold hover:text-brand-dark text-xs font-bold py-2.5 rounded-xl transition-all duration-200 border border-gold/15 hover:border-gold hover:shadow-gold-glow"
            >
              View Details
            </Link>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-green-500/8 hover:bg-green-500 rounded-xl flex items-center justify-center transition-all group/wa border border-green-500/15 hover:border-green-500 hover:shadow-lg"
              aria-label="WhatsApp inquiry"
            >
              {WA_SVG}
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
