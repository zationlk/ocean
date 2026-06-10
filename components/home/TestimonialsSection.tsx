import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-brand-bg">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Testimonials
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p className="text-brand-text max-w-xl mx-auto">
            Don&apos;t just take our word for it — hear from our satisfied customers across Sri Lanka.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border border-brand-border hover:border-brand-primary hover:shadow-card-hover transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary transition-colors">
                <Quote size={18} className="text-brand-primary group-hover:text-white transition-colors" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-brand-text text-sm leading-relaxed mb-5 line-clamp-3">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                <div className="w-10 h-10 bg-teal-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-brand-text">
                    {testimonial.role}
                    {testimonial.company && `, ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
