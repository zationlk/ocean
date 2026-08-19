"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Phone, Heart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription?: string;
  short_description?: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  badge?: string;
  isNew?: boolean;
}

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function QuickViewModal({ product, onClose }: QuickViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { add, remove, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product!.id);

  useEffect(() => { setActiveImage(0); }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  const shortDesc = product.shortDescription || product.short_description || "";
  const whatsappMsg = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}". Could you please provide more details and pricing?`
  );

  const prevImg = () => setActiveImage(i => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () => setActiveImage(i => (i + 1) % product.images.length);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-brand-charcoal rounded-2xl border border-brand-border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-brand-obsidian/90 hover:bg-red-500/20 border border-brand-border hover:border-red-500/30 rounded-full flex items-center justify-center text-brand-text hover:text-red-400 transition-all"
          aria-label="Close quick view"
        >
          <X size={16} />
        </button>

        <div className="grid md:grid-cols-2 overflow-y-auto md:overflow-hidden">
          {/* ── Image ── */}
          <div className="relative bg-brand-obsidian md:max-h-[92vh]">
            <div className="aspect-square md:h-full">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.badge && (
              <div className="absolute top-4 left-4 bg-gold text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-gold-glow">
                {product.badge}
              </div>
            )}

            {product.images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all">
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={cn("rounded-full transition-all", i === activeImage ? "w-5 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Info ── */}
          <div className="p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="text-[10px] text-gold font-bold uppercase tracking-widest">
              {product.category.replace(/-/g, " ")}
            </div>

            <h2 className="font-display text-xl font-bold text-white leading-snug">
              {product.name}
            </h2>

            <p className="text-brand-text text-sm leading-relaxed font-light pb-4 border-b border-brand-border">
              {shortDesc}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider mb-2">Key Features</p>
                <ul className="space-y-1.5">
                  {product.features.slice(0, 4).map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-brand-text">
                      <span className="w-3.5 h-3.5 bg-gold/15 rounded-full flex items-center justify-center shrink-0 border border-gold/20">
                        <Check size={9} className="text-gold" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-brand-text/50 uppercase tracking-wider mb-2">Specifications</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(product.specifications).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="bg-brand-obsidian rounded-lg px-3 py-2 border border-brand-border/50">
                      <div className="text-[9px] text-brand-text/40 uppercase tracking-wide">{k}</div>
                      <div className="text-xs text-white font-medium mt-0.5 truncate">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-2 pt-2">
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                {WA_ICON} Inquire on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-600 text-brand-dark font-bold py-2.5 rounded-xl transition-all text-sm hover:shadow-gold-glow"
                >
                  View Full Details <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => inWishlist
                    ? remove(product.id)
                    : add({ id: product.id, name: product.name, slug: product.slug, image: product.images[0], category: product.category })
                  }
                  className={cn(
                    "flex items-center justify-center gap-1.5 font-semibold py-2.5 rounded-xl transition-all border text-sm",
                    inWishlist
                      ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      : "bg-brand-obsidian text-brand-text border-brand-border hover:border-gold/40 hover:text-gold"
                  )}
                >
                  <Heart size={14} className={inWishlist ? "fill-red-400" : ""} />
                  {inWishlist ? "Saved" : "Save"}
                </button>
              </div>
              <a
                href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                className="w-full flex items-center justify-center gap-2 border border-brand-border text-brand-text hover:border-gold/30 hover:text-gold font-medium py-2 rounded-xl transition-all text-xs"
              >
                <Phone size={13} /> {siteSettings.telephone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!product || !mounted) return null;

  // Render into document.body via portal — fixes rendering inside card
  return createPortal(
    <QuickViewModal product={product} onClose={onClose} />,
    document.body
  );
}
