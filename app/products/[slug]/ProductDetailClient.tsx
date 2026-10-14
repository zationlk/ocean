"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Phone, MessageCircle, Check, ArrowLeft, ZoomIn, X, Heart, GitCompare, Layers } from "lucide-react";
import { Product, SiteSettings } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { cn, buildProductWhatsAppMessage } from "@/lib/utils";
import { fetchSettingsCached } from "@/lib/settings-cache";
import { getProductImage, handleImageFallback } from "@/lib/image-utils";

interface Props {
  product: Product;
  related: Product[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "",
  tagline: "",
  address: "",
  email: "",
  website: "",
  telephone: "",
  mobile: "",
  whatsapp: "",
  businessHours: { weekdays: "", saturday: "", sunday: "" },
  socialMedia: { facebook: "", instagram: "" },
  heroTitle: "",
  heroSubtitle: "",
  aboutText: "",
  metaDescription: "",
};

export default function ProductDetailClient({ product, related }: Props) {
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "features">("description");
  const [zoomed, setZoomed] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Sync if product prop changes
  useEffect(() => {
    setCurrentProduct(product);
    setActiveImage(0);
  }, [product]);

  const { add: addWishlist, remove: removeWishlist, isInWishlist } = useWishlist();
  const { add: addCompare, remove: removeCompare, isInCompare, items: compareItems } = useCompare();
  const { items: recentItems, add: addRecent } = useRecentlyViewed();

  const inWishlist = isInWishlist(currentProduct.id);
  const inCompare = isInCompare(currentProduct.id);

  // Track recently viewed
  useEffect(() => {
    addRecent({
      id: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      image: currentProduct.images[0],
      category: currentProduct.category,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct.id]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed]);

  useEffect(() => {
    fetchSettingsCached()
      .then((data: any) => {
        const settings = Array.isArray(data) ? data[0] : (data.data || data);
        if (settings) {
          setSiteSettings({ ...DEFAULT_SETTINGS, ...settings });
        }
      })
      .catch((error) => console.error("Failed to fetch settings:", error))
      .finally(() => setSettingsLoading(false));
  }, []);

  const whatsappMessage = encodeURIComponent(buildProductWhatsAppMessage(currentProduct));

  const whatsappHref = siteSettings.whatsapp
    ? `https://wa.me/${siteSettings.whatsapp}?text=${whatsappMessage}`
    : "#";
  const telephoneHref = siteSettings.telephone
    ? `tel:${siteSettings.telephone.replace(/\s/g, "")}`
    : "#";

  // Family variants (parent + all children)
  const allVariants = product.variants && product.variants.length > 0 ? product.variants : [currentProduct];

  // Recently viewed excluding current
  const recentlySeen = recentItems.filter((i) => i.id !== currentProduct.id).slice(0, 4);

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
            <Link href={`/lighting?category=${currentProduct.category}`} className="hover:text-gold transition-colors capitalize">
              {currentProduct.category?.replace(/-/g, " ")}
            </Link>
            <ChevronRight size={12} className="text-brand-text/30" />
            <span className="text-white font-medium truncate max-w-[200px]">{currentProduct.name}</span>
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
                src={getProductImage(currentProduct.images?.[activeImage])}
                alt={currentProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={handleImageFallback}
              />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs">
                <ZoomIn size={13} /> Click to zoom
              </div>
              {currentProduct.badge && (
                <div className="absolute top-4 left-4 bg-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-gold-glow">
                  {currentProduct.badge}
                </div>
              )}
              {currentProduct.isNew && !currentProduct.badge && (
                <div className="absolute top-4 left-4 bg-brand-primary text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  New
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {currentProduct.images?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {currentProduct.images.map((img, i) => (
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
                    <img
                      src={getProductImage(img)}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={handleImageFallback}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div>
            <div className="text-xs text-gold font-bold uppercase tracking-widest mb-3">
              {currentProduct.category?.replace(/-/g, " ")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 leading-snug">
              {currentProduct.name}
            </h1>
            {currentProduct.modelNumber && (
              <div className="text-sm text-white/40 font-mono mb-4">
                Model Number: <span className="text-white/60">{currentProduct.modelNumber}</span>
              </div>
            )}
            <p className="text-brand-text leading-relaxed mb-6 pb-6 border-b border-brand-border font-light">
              {currentProduct.shortDescription}
            </p>

            {/* ── VARIATION SWITCHER ── */}
            {allVariants.length > 1 && (
              <div className="mb-6 p-4 rounded-2xl bg-brand-charcoal border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} className="text-gold" />
                    Available Variations ({allVariants.length})
                  </span>
                  {currentProduct.modelNumber && (
                    <span className="text-[11px] font-mono text-gold/80">
                      Active: {currentProduct.modelNumber}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allVariants.map((v) => {
                    const isSelected = v.id === currentProduct.id;
                    const attrSummary = v.variantAttributes && Object.keys(v.variantAttributes).length > 0
                      ? Object.values(v.variantAttributes).join(" • ")
                      : v.name.replace(product.name, "").replace(/^[-\s]+/, "") || v.name;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setCurrentProduct(v);
                          setActiveImage(0);
                          if (typeof window !== "undefined" && v.slug) {
                            window.history.replaceState(null, "", `/products/${v.slug}`);
                          }
                        }}
                        className={cn(
                          "text-left p-3 rounded-xl border transition-all flex items-center justify-between group",
                          isSelected
                            ? "bg-gold/15 border-gold shadow-gold-glow text-white"
                            : "bg-brand-obsidian/60 border-white/8 hover:border-gold/40 text-brand-text hover:text-white"
                        )}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                            <span>{attrSummary}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                          </div>
                          {v.modelNumber && (
                            <div className="text-[10px] font-mono text-white/40 group-hover:text-white/60">
                              {v.modelNumber}
                            </div>
                          )}
                        </div>
                        {v.badge && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-gold text-brand-dark px-1.5 py-0.5 rounded shrink-0">
                            {v.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {currentProduct.features && currentProduct.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProduct.features.slice(0, 6).map((feature) => (
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
                onClick={() => inWishlist ? removeWishlist(currentProduct.id) : addWishlist({ id: currentProduct.id, name: currentProduct.name, slug: currentProduct.slug, image: currentProduct.images[0], category: currentProduct.category })}
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
                  onClick={() => inCompare ? removeCompare(currentProduct.id) : addCompare({ id: currentProduct.id, name: currentProduct.name, slug: currentProduct.slug, image: currentProduct.images[0], category: currentProduct.category, specifications: currentProduct.specifications, features: currentProduct.features, shortDescription: currentProduct.shortDescription })}
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
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-green-500/20 text-sm"
              >
                <MessageCircle size={18} />
                Inquire on WhatsApp with This Variant
              </a>

              <a
                href={telephoneHref}
                className="w-full flex items-center justify-center gap-2.5 bg-gold/10 hover:bg-gold text-gold hover:text-brand-dark font-bold py-4 px-6 rounded-2xl transition-all border border-gold/30 hover:border-gold hover:shadow-gold-glow text-sm"
              >
                <Phone size={18} />
                Call Showroom: {settingsLoading ? "Loading…" : siteSettings.telephone || "Call Now"}
              </a>
            </div>

            {/* Quick trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-brand-border text-center">
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
              <p className="text-brand-text leading-relaxed text-base font-light">{currentProduct.description}</p>
            )}
            {activeTab === "specs" && currentProduct.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(currentProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                    <span className="text-sm font-semibold text-white min-w-[130px]">{key}</span>
                    <span className="text-sm text-brand-text font-light">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "features" && currentProduct.features && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentProduct.features.map((feature) => (
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
            <h2 className="font-display text-xl font-bold text-white mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlySeen.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group bg-brand-charcoal rounded-xl border border-brand-border p-3 hover:border-gold/40 transition-colors"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-brand-obsidian mb-2">
                    <img
                      src={getProductImage(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={handleImageFallback}
                    />
                  </div>
                  <p className="text-xs text-white font-medium truncate group-hover:text-gold transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-brand-text/50 capitalize mt-0.5">
                    {item.category.replace(/-/g, " ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
            aria-label="Close zoomed view"
          >
            <X size={20} />
          </button>
          <img
            src={getProductImage(currentProduct.images?.[activeImage])}
            alt={currentProduct.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            referrerPolicy="no-referrer"
            onError={handleImageFallback}
          />
        </div>
      )}
    </div>
  );
}
