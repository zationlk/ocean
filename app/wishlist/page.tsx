"use client";

import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Heart, X, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            <Heart size={14} className="text-red-400 fill-red-400" />
            My Wishlist
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Saved Products
          </h1>
          <p className="text-teal-200">
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} product${items.length > 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-brand-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-brand-text mb-8 max-w-sm mx-auto">
              Browse our products and save the ones you love by clicking the heart icon.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-teal-glow"
            >
              <ShoppingBag size={18} />
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-semibold text-gray-900 text-lg">
                {items.length} Saved {items.length === 1 ? "Item" : "Items"}
              </h2>
              <button
                onClick={clear}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
              >
                <X size={16} />
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
                    className="bg-white rounded-2xl border border-brand-border overflow-hidden hover:border-brand-primary hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button
                        onClick={() => remove(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-brand-primary font-semibold uppercase tracking-wider mb-1.5">
                        {item.category.replace(/-/g, " ")}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors">
                        <Link href={`/products/${item.slug}`}>{item.name}</Link>
                      </h3>
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex-1 flex items-center justify-center gap-1 bg-teal-50 hover:bg-brand-primary text-brand-primary hover:text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-300"
                        >
                          View
                          <ArrowRight size={14} />
                        </Link>
                        <a
                          href={`https://wa.me/${siteSettings.whatsapp}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-50 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors group/wa"
                          aria-label="Inquire on WhatsApp"
                        >
                          <MessageCircle size={16} className="text-green-600 group-hover/wa:text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send wishlist via WhatsApp */}
            <div className="mt-12 bg-white rounded-2xl border border-brand-border p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Share Your Wishlist
                </h3>
                <p className="text-brand-text text-sm">
                  Send us your entire wishlist via WhatsApp and we&apos;ll get back with pricing and availability.
                </p>
              </div>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(
                  `Hello! I'm interested in the following products:\n${items.map((i) => `• ${i.name}`).join("\n")}\n\nCould you please provide pricing and availability?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
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
