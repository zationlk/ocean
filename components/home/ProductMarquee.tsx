import { products } from "@/lib/data";
import Link from "next/link";

export default function ProductMarquee() {
  // Duplicate array for seamless loop
  const items = [...products, ...products];

  return (
    <section className="py-10 bg-white border-y border-brand-border overflow-hidden">
      <div className="mb-4 text-center">
        <p className="text-xs uppercase tracking-widest font-semibold text-brand-primary">
          Explore our range
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div
          className="flex gap-5 animate-marquee"
          style={{ width: "max-content" }}
        >
          {items.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              href={`/products/${product.slug}`}
              className="group flex-shrink-0 flex flex-col items-center w-36 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-36 h-36 rounded-2xl overflow-hidden border border-brand-border group-hover:border-brand-primary group-hover:shadow-card transition-all duration-300 bg-gray-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs text-center text-brand-text font-medium line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
                {product.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
