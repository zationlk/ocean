"use client";

import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Heart, X, ShoppingBag, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();

  return (
    <div className="min-h-screen bg-brand-obsidian">
      <div className="bg-hero-gradient text-white py-16 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gold/8 blur-[100px] rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
            <Heart size={12} className="fill-gold" />
            My Wishlist
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            Saved Products
          </h1>
          <p className="text-brand-text font-light">
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} product${items.length > 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
              <Heart size={40} className="text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3 tracking-wide">
              Your wishlist is empty
            </h2>
            <p className="text-brand-text mb-8 max-w-sm mx-auto font-light leading-relaxed text-sm">
              Browse our products and save the ones you love by clicking the heart icon.
            </p>
            <Link
              href="/lighting"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
            >
              <ShoppingBag size={18} />
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-semibold text-white text-lg">
                {items.length} Saved {items.length === 1 ? "Item" : "Items"}
              </h2>
              <button
                onClick={clear}
                className="text-sm text-brand-text/60 hover:text-red-400 font-medium transition-colors flex items-center gap-1"
              >
                <X size={15} />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const whatsappMsg = encodeURIComponent(
                  `Hello! I'm interested in "${item.name}". Could you provide details and pricing?`
                );
                return (
                  <div
                    key={item.id}
                    className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden hover:border-gold/40 hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden bg-brand-obsidian">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button
                        onClick={() => remove(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-brand-obsidian/70 hover:bg-red-500/20 border border-brand-border rounded-full flex items-center justify-center transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <X size={13} className="text-red-400" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gold font-semibold uppercase tracking-wider mb-1.5">
                        {item.category.replace(/-/g, " ")}
                      </div>
                      <h3 className="font-semibold text-white mb-4 line-clamp-2 text-sm group-hover:text-gold transition-colors leading-snug">
                        <Link href={`/products/${item.slug}`}>{item.name}</Link>
                      </h3>
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-brand-dark text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 border border-gold/20 hover:border-gold"
                        >
                          View <ArrowRight size={13} />
                        </Link>
                        <a
                          href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:border-green-500 rounded-lg flex items-center justify-center transition-all duration-300 group/wa"
                          aria-label="Inquire on WhatsApp"
                        >
                          <MessageCircle size={15} className="text-green-400 group-hover/wa:text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 bg-brand-charcoal rounded-2xl border border-brand-border p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={15} className="text-gold" />
                  <h3 className="font-semibold text-white text-lg">Share Your Wishlist</h3>
                </div>
                <p className="text-brand-text text-sm font-light leading-relaxed">
                  Send us your entire wishlist via WhatsApp and we&apos;ll reply with pricing and availability.
                </p>
              </div>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(
                  `Hello! I'm interested in the following products:\n${items.map((i) => `• ${i.name}`).join("\n")}\n\nCould you please provide pricing and availability?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send Wishlist via WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
