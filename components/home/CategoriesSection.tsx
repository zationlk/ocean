import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, products } from "@/lib/data";

export default function CategoriesSection() {
  // Compute product count per category
  const countMap: Record<string, number> = {};
  products.forEach((p) => {
    countMap[p.category] = (countMap[p.category] || 0) + 1;
  });

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <span>Our Categories</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Product Range
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p className="text-brand-text max-w-2xl mx-auto">
            From energy-efficient LED solutions to elegant interior lighting, we offer a comprehensive range of premium lighting and electrical products.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category, index) => {
            const count = countMap[category.slug] || 0;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-brand-border hover:border-brand-primary transition-all duration-300 product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />

                  {/* Icon */}
                  <div className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl">
                    {category.icon}
                  </div>

                  {/* Product count badge */}
                  {count > 0 && (
                    <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {count} product{count !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-brand-text line-clamp-2 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1 text-brand-primary text-xs font-semibold">
                    <span>Browse</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 border-2 border-brand-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:gap-3 transition-all duration-200"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}