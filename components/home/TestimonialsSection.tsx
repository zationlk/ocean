"use client";

import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-brand-bg relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] -translate-y-1/2 bg-gold/3 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-gold/20">
            Client Stories
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            What Our Customers Say
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p className="text-brand-text/60 max-w-xl mx-auto text-sm font-light">
            Trusted by 1,000+ customers across Sri Lanka
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-brand-charcoal rounded-2xl p-6 border border-brand-border hover:border-gold/40 transition-all duration-300 overflow-hidden"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              {/* Large decorative quote */}
              <Quote size={48} className="absolute top-4 right-4 text-gold/8 group-hover:text-gold/15 transition-colors duration-300" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-brand-text/80 text-sm leading-relaxed mb-5 relative z-10 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gold/20 to-transparent mb-4" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #8C6E1C, #D4AF37)" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm leading-tight">{t.name}</div>
                  <div className="text-xs text-brand-text/50 mt-0.5">
                    {t.role}
                    {t.company && <span className="text-gold/60">, {t.company}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 bg-brand-charcoal border border-brand-border rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {["P","C","N","D"].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-brand-charcoal flex items-center justify-center text-brand-dark text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #8C6E1C, #D4AF37)" }}>
                  {l}
                </div>
              ))}
            </div>
            <span className="text-brand-text/70 text-sm font-light">
              Trusted by <span className="text-gold font-semibold">1,000+</span> customers
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
