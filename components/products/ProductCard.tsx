"use client";

import Link from "next/link";
import { Eye, MessageCircle, Heart, GitCompare, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import QuickView from "@/components/ui/QuickView";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

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

export default function ProductCard({ product }: ProductCardProps) {
  const { add, remove, isInWishlist } = useWishlist();
  const { add: addCompare, remove: removeCompare, isInCompare, items: compareItems } = useCompare();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const isBathware = !product.category?.startsWith("led-");
  const brandName = isBathware ? "OCEANA" : "OCEAN Lighting Solutions";
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}" from ${brandName}. Could you please provide more details?`
  );

  const shortDesc =
    product.shortDescription ||
    product.short_description ||
    product.description ||
    "";
  const displayImage = product.images?.[0] || "/placeholder-product.jpg";
  const isNew = product.isNew || product.is_new;
  const badge = product.badge;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      remove(product.id);
    } else {
      add({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: displayImage,
        category: product.category,
      });
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeCompare(product.id);
    } else if (compareItems.length < 3) {
      addCompare({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: displayImage,
        category: product.category,
        specifications: product.specifications,
        features: product.features,
        shortDescription: product.shortDescription || product.short_description,
      });
    }
  };

  return (
    <div className="group bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden product-card hover:border-gold/50 hover:shadow-gold-glow">
      <QuickView product={quickViewOpen ? (product as Parameters<typeof QuickView>[0]["product"]) : null} onClose={() => setQuickViewOpen(false)} />
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-brand-obsidian">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {badge && (
            <span className="bg-brand-primary text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {badge}
            </span>
          )}
          {isNew && !badge && (
            <span className="bg-gold text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10",
            inWishlist
              ? "bg-red-500 text-white"
              : "bg-brand-charcoal/80 hover:bg-brand-charcoal text-white/70 hover:text-red-500 border border-brand-border"
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={cn(inWishlist ? "fill-white" : "")}
          />
        </button>

        {/* Compare button */}
        <button
          onClick={handleCompare}
          title={compareItems.length >= 3 && !inCompare ? "Max 3 products" : inCompare ? "Remove from compare" : "Add to compare"}
          className={cn(
            "absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10 opacity-0 group-hover:opacity-100",
            inCompare
              ? "bg-gold text-brand-dark"
              : compareItems.length >= 3
              ? "bg-brand-obsidian text-white/30 cursor-not-allowed border border-brand-border"
              : "bg-brand-charcoal/80 hover:bg-brand-charcoal text-white/70 hover:text-gold border border-brand-border"
          )}
          aria-label="Compare"
        >
          <GitCompare size={13} />
        </button>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-0">
          <button
            onClick={(e) => { e.preventDefault(); setQuickViewOpen(true); }}
            className="w-10 h-10 bg-brand-charcoal/90 rounded-full flex items-center justify-center hover:bg-gold hover:text-brand-dark border border-brand-border/50 transition-colors shadow-lg"
            aria-label="Quick view"
            title="Quick view"
          >
            <Maximize2 size={15} className="text-white" />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-10 h-10 bg-brand-charcoal/90 rounded-full flex items-center justify-center hover:bg-gold hover:text-brand-dark border border-brand-border/50 transition-colors shadow-lg"
            aria-label="View product"
          >
            <Eye size={16} className="text-white" />
          </Link>
          <a
            href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg"
            aria-label="Inquire on WhatsApp"
          >
            <MessageCircle size={16} className="text-white" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="text-[10px] text-gold font-bold uppercase tracking-widest mb-2">
          {product.category?.replace(/-/g, " ")}
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors leading-snug">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Description */}
        <p className="text-xs text-brand-text font-light line-clamp-2 mb-4 leading-relaxed">{shortDesc}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center bg-gold/10 hover:bg-gold text-gold hover:text-brand-dark text-xs font-bold py-2.5 rounded-lg transition-all duration-300 uppercase tracking-wider border border-gold/10"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-500/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors group/wa border border-green-500/10"
            aria-label="Inquire on WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-green-500 group-hover/wa:fill-white transition-colors"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
