import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-brand-obsidian">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-gold/20">
            Client Stories
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            What Our Customers Say
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p className="text-brand-text max-w-xl mx-auto text-sm font-light leading-relaxed">
            Trusted by 1000+ Customers in Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-brand-charcoal rounded-2xl p-7 border border-brand-border hover:border-gold/50 hover:shadow-card-hover transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div
                className="absolute top-4 right-5 font-display text-8xl leading-none text-gold/10 group-hover:text-gold/20 transition-colors duration-300 select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={15} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-brand-text text-sm leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="h-px bg-brand-border mb-5" />
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gold-gradient rounded-full flex items-center justify-center text-brand-dark font-bold text-sm shrink-0 shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm leading-tight">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-brand-text mt-0.5">
                    {testimonial.role}
                    {testimonial.company && (
                      <span className="text-gold/70">, {testimonial.company}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-brand-charcoal border border-brand-border rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {["P", "C", "N", "D"].map((initial, i) => (
                <div
                  key={i}
                  className="w-7 h-7 bg-gold-gradient rounded-full border-2 border-brand-charcoal flex items-center justify-center text-brand-dark text-xs font-bold"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-brand-text text-sm font-light">
              Trusted by{" "}
              <span className="text-gold font-semibold">1,000+ happy customers</span> across Sri Lanka
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
