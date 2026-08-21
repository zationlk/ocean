"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Check, Phone, Heart, ChevronLeft, ChevronRight, ArrowRight, ZoomIn } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { add, remove, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  useEffect(() => { setActiveImage(0); setZoomed(false); }, [product.id]);

  const handleClose = useCallback(() => {
    document.body.style.overflow = "";
    onClose();
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClose]);

  const shortDesc = product.shortDescription || product.short_description || "";
  const whatsappMsg = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}". Could you please provide more details and pricing?`
  );
  const prevImg = () => { setActiveImage(i => (i - 1 + product.images.length) % product.images.length); setZoomed(false); };
  const nextImg = () => { setActiveImage(i => (i + 1) % product.images.length); setZoomed(false); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
      onClick={handleClose}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-4xl bg-brand-charcoal rounded-3xl border border-brand-border shadow-2xl overflow-hidden"
        style={{ maxHeight: "calc(100vh - 32px)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 bg-brand-obsidian/90 hover:bg-red-500/15 border border-brand-border hover:border-red-500/30 rounded-full flex items-center justify-center text-brand-text/60 hover:text-red-400 transition-all"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* ── Scrollable container on mobile, side-by-side on md+ ── */}
        <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden" style={{ maxHeight: "calc(100vh - 32px)" }}>

          {/* Image panel */}
          <div className="relative md:w-[45%] md:shrink-0 bg-brand-obsidian md:h-auto">
            {/* Main image */}
            <div
              className="relative overflow-hidden cursor-zoom-in"
              style={{ aspectRatio: "1/1" }}
              onClick={() => setZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] flex items-center gap-1 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={10} /> Zoom
              </div>

              {/* Badge */}
              {(product.badge || product.isNew) && (
                <div className="absolute top-3 left-3 bg-gold text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.badge || "New"}
                </div>
              )}
            </div>

            {/* Image nav */}
            {product.images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all z-10">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all z-10">
                  <ChevronRight size={15} />
                </button>
                {/* Thumbnails row */}
                <div className="flex gap-2 p-3 bg-brand-bg overflow-x-auto scrollbar-none">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImage(i); setZoomed(false); }}
                      className={cn(
                        "w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                        i === activeImage ? "border-gold shadow-gold-glow" : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info panel */}
          <div className="flex-1 flex flex-col p-5 sm:p-6 overflow-y-auto">
            {/* Category */}
            <div className="text-[10px] text-gold font-bold uppercase tracking-widest mb-2">
              {product.category.replace(/-/g, " ")}
            </div>

            {/* Name */}
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
              {product.name}
            </h2>

            {/* Description */}
            {shortDesc && (
              <p className="text-brand-text/80 text-sm leading-relaxed font-light pb-4 mb-4 border-b border-brand-border">
                {shortDesc}
              </p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2.5">Key Features</p>
                <ul className="space-y-1.5">
                  {product.features.slice(0, 5).map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-brand-text/80">
                      <span className="mt-0.5 w-3.5 h-3.5 bg-gold/15 rounded-full flex items-center justify-center shrink-0 border border-gold/25">
                        <Check size={8} className="text-gold" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest mb-2.5">Specifications</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(product.specifications).slice(0, 6).map(([k, v]) => (
                    <div key={k} className="bg-brand-bg rounded-xl px-3 py-2 border border-brand-border/40">
                      <div className="text-[9px] text-brand-text/40 uppercase tracking-wide mb-0.5">{k}</div>
                      <div className="text-xs text-white font-medium truncate">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions — pinned to bottom */}
            <div className="mt-auto space-y-2.5 pt-4 border-t border-brand-border">
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl transition-all text-sm hover:shadow-lg"
              >
                {WA_ICON} Inquire on WhatsApp
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={handleClose}
                  className="flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-600 text-brand-dark font-bold py-3 rounded-2xl transition-all text-sm hover:shadow-gold-glow"
                >
                  View Details <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => inWishlist
                    ? remove(product.id)
                    : add({ id: product.id, name: product.name, slug: product.slug, image: product.images[0], category: product.category })
                  }
                  className={cn(
                    "flex items-center justify-center gap-1.5 font-semibold py-3 rounded-2xl transition-all border text-sm",
                    inWishlist
                      ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15"
                      : "bg-brand-obsidian text-brand-text/70 border-brand-border hover:border-gold/40 hover:text-gold"
                  )}
                >
                  <Heart size={14} className={inWishlist ? "fill-red-400" : ""} />
                  {inWishlist ? "Saved" : "Save"}
                </button>
              </div>

              <a
                href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                className="w-full flex items-center justify-center gap-2 border border-brand-border/60 text-brand-text/50 hover:border-gold/30 hover:text-gold font-medium py-2.5 rounded-2xl transition-all text-xs"
              >
                <Phone size={12} /> {siteSettings.telephone}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen zoom overlay */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <button onClick={() => setZoomed(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
              <X size={18} />
            </button>
            <motion.img
              src={product.images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {product && <QuickViewModal key={product.id} product={product} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}
