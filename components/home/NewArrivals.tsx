import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { products } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";

export default function NewArrivals() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  if (newProducts.length === 0) return null;

  return (
    <section className="section-padding bg-brand-bg">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
              <Sparkles size={12} className="text-gold" />
              New Arrivals
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
              Just Landed
            </h2>
            <div className="section-divider" />
          </div>
          <Link href="/lighting" className="inline-flex items-center gap-2 text-gold font-bold hover:gap-3 transition-all duration-200 shrink-0 text-sm tracking-wider uppercase">
            View All New <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
