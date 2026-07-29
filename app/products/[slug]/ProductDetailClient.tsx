"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Phone, MessageCircle, Check, ArrowLeft } from "lucide-react";
import { Product } from "@/lib/types";
import { siteSettings } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "features">("description");

  const isBathware = !product.category?.startsWith("led-");
  const brandName = isBathware ? "OCEANA" : "OCEAN Lighting Solutions";
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in the "${product.name}" from ${brandName}. Could you please provide more details and pricing?`
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Breadcrumb */}
      <div className="bg-brand-charcoal border-b border-brand-border">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-brand-text">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-brand-primary transition-colors">Products</Link>
            <ChevronRight size={14} />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-brand-primary transition-colors capitalize"
            >
              {product.category.replace(/-/g, " ")}
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-brand-text hover:text-brand-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Product detail */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-brand-charcoal border border-brand-border mb-4 aspect-square">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-brand-primary text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-brand-primary shadow-gold-glow"
                        : "border-brand-border hover:border-brand-light"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category */}
            <div className="text-sm text-brand-primary font-semibold uppercase tracking-wider mb-3">
              {product.category.replace(/-/g, " ")}
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {product.name}
            </h1>

            {/* Short description */}
            <p className="text-brand-text text-lg leading-relaxed mb-6 pb-6 border-b border-brand-border">
              {product.shortDescription}
            </p>

            {/* Key features preview */}
            {product.features && (
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-brand-text">
                      <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center shrink-0 border border-gold/20">
                        <Check size={12} className="text-gold" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                  className="flex items-center justify-center gap-2 border-2 border-brand-primary text-gold hover:bg-brand-primary hover:text-brand-dark font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <Phone size={18} />
                  Call Us
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-gold-600 text-brand-dark font-bold py-3 rounded-xl transition-all duration-300"
                >
                  <MessageCircle size={18} />
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden mb-16">
          {/* Tab headers */}
          <div className="flex border-b border-brand-border">
            {(["description", "specs", "features"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-gold border-b-2 border-gold bg-gold/10"
                    : "text-brand-text hover:text-brand-primary"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-brand-text leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {activeTab === "specs" && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl">
                    <span className="text-sm font-semibold text-white min-w-[140px]">{key}</span>
                    <span className="text-sm text-brand-text">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && product.features && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl">
                    <div className="w-6 h-6 bg-gold-gradient rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-brand-text">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
