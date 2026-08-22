"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Phone, MessageCircle, Check, ArrowLeft, ZoomIn, X, Heart, GitCompare } from "lucide-react";
import { Product } from "@/lib/types";
import { siteSettings } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "features">("description");
  const [zoomed, setZoomed] = useState(false);

  const { add: addWishlist, remove: removeWishlist, isInWishlist } = useWishlist();
  const { add: addCompare, remove: removeCompare, isInCompare, items: compareItems } = useCompare();
  const { items: recentItems, add: addRecent } = useRecentlyViewed();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  // Track recently viewed
  useEffect(() => {
    addRecent({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      category: product.category,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed]);

  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}" from Ocean Lighting Solutions. Could you please provide more details and pricing?`
  );

  // Recently viewed excluding current
  const recentlySeen = recentItems.filter((i) => i.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Breadcrumb */}
      <div className="bg-brand-charcoal border-b border-brand-border">
        <div className="container-custom py-3.5">
          <nav className="flex items-center gap-2 text-xs text-brand-text flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={12} className="text-brand-text/30" />
            <Link href="/lighting" className="hover:text-gold transition-colors">Products</Link>
            <ChevronRight size={12} className="text-brand-text/30" />
            <Link href={`/lighting?category=${product.category}`} className="hover:text-gold transition-colors capitalize">
              {product.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight size={12} className="text-brand-text/30" />
            <span className="text-white font-medium truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <Link href="/lighting" className="inline-flex items-center gap-2 text-brand-text hover:text-gold text-sm mb-8 transition-colors group">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </Link>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* ── Images ── */}
          <div className="space-y-3">
            {/* Main image with zoom */}
            <div
              className="relative rounded-2xl overflow-hidden bg-brand-charcoal border border-brand-border aspect-square cursor-zoom-in group"
              onClick={() => setZoomed(true)}
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs">
                <ZoomIn size={13} /> Click to zoom
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-gold-glow">
                  {product.badge}
                </div>
              )}
              {product.isNew && !product.badge && (
                <div className="absolute top-4 left-4 bg-brand-primary text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  New
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                      activeImage === i
                        ? "border-gold shadow-gold-glow scale-105"
                        : "border-brand-border hover:border-gold/40 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            <div className="text-xs text-gold font-bold uppercase tracking-widest mb-3">
              {product.category.replace(/-/g, " ")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
              {product.name}
            </h1>
            <p className="text-brand-text leading-relaxed mb-6 pb-6 border-b border-brand-border font-light">
              {product.shortDescription}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-brand-text">
                      <div className="w-4 h-4 bg-gold/15 rounded-full flex items-center justify-center shrink-0 border border-gold/25">
                        <Check size={10} className="text-gold" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Wishlist + Compare row */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => inWishlist ? removeWishlist(product.id) : addWishlist({ id: product.id, name: product.name, slug: product.slug, image: product.images[0], category: product.category })}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all",
                  inWishlist ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-brand-charcoal text-brand-text border-brand-border hover:border-gold/30 hover:text-gold"
                )}
              >
                <Heart size={13} className={inWishlist ? "fill-red-400" : ""} />
                {inWishlist ? "Saved" : "Save"}
              </button>
              {compareItems.length < 3 || inCompare ? (
                <button
                  onClick={() => inCompare ? removeCompare(product.id) : addCompare({ id: product.id, name: product.name, slug: product.slug, image: product.images[0], category: product.category, specifications: product.specifications, features: product.features, shortDescription: product.shortDescription })}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all",
                    inCompare ? "bg-gold/15 text-gold border-gold/30" : "bg-brand-charcoal text-brand-text border-brand-border hover:border-gold/30 hover:text-gold"
                  )}
                >
                  <GitCompare size={13} />
                  {inCompare ? "Comparing" : "Compare"}
                </button>
              ) : null}
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Inquire on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 border-2 border-gold/40 text-gold hover:bg-gold hover:text-brand-dark font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <Phone size={17} /> Call Us
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
                >
                  <MessageCircle size={17} /> Get Quote
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-brand-border grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Warranty", sub: "Manufacturer backed" },
                { label: "Delivery", sub: "Island-wide" },
                { label: "Expert Advice", sub: "Free consultation" },
              ].map((b) => (
                <div key={b.label} className="bg-brand-charcoal rounded-xl p-3 border border-brand-border">
                  <div className="text-xs font-bold text-gold">{b.label}</div>
                  <div className="text-[10px] text-brand-text/60 mt-0.5">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden mb-16">
          <div className="flex border-b border-brand-border">
            {(["description", "specs", "features"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-4 text-sm font-semibold capitalize transition-all",
                  activeTab === tab
                    ? "text-gold border-b-2 border-gold bg-gold/8"
                    : "text-brand-text hover:text-gold"
                )}
              >
                {tab === "specs" ? "Specifications" : tab}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            {activeTab === "description" && (
              <p className="text-brand-text leading-relaxed text-base font-light">{product.description}</p>
            )}
            {activeTab === "specs" && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                    <span className="text-sm font-semibold text-white min-w-[130px]">{key}</span>
                    <span className="text-sm text-brand-text font-light">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "features" && product.features && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                    <div className="w-5 h-5 bg-gold-gradient rounded-full flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-brand-text font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold text-white mb-8 tracking-wide">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recentlySeen.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6 tracking-wide flex items-center gap-2">
              <span className="text-gold text-sm">◈</span> Recently Viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlySeen.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group bg-brand-charcoal rounded-xl border border-brand-border hover:border-gold/30 overflow-hidden transition-all"
                >
                  <div className="h-32 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-gold font-bold uppercase tracking-wider mb-0.5">{item.category.replace(/-/g, " ")}</div>
                    <div className="text-sm text-white font-medium line-clamp-2 group-hover:text-gold transition-colors leading-snug">{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox zoom */}
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={cn("rounded-full transition-all", i === activeImage ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-white/40")}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
