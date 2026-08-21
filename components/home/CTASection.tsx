"use client";

import Link from "next/link";
import { Phone, MessageCircle, MapPin, ArrowRight, Clock, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { siteSettings } from "@/lib/data";

const cards = [
  {
    Icon: Phone,
    title: "Call Us",
    line1: siteSettings.telephone,
    line2: siteSettings.mobile,
    cta: "Call Now",
    href: `tel:${siteSettings.telephone.replace(/\s/g, "")}`,
    external: false,
    color: "gold",
  },
  {
    Icon: MessageCircle,
    title: "WhatsApp",
    line1: "Chat with a consultant",
    line2: "Quick response guaranteed",
    cta: "Chat Now",
    href: `https://wa.me/${siteSettings.whatsapp}`,
    external: true,
    color: "green",
  },
  {
    Icon: MapPin,
    title: "Visit Showroom",
    line1: "591, Chilaw Road",
    line2: "Kattuwa, Negombo",
    cta: "Get Directions",
    href: "/contact",
    external: false,
    color: "gold",
  },
] as const;

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-obsidian via-[#160f02] to-brand-obsidian" />
        <div className="absolute inset-0 bg-gold-gradient opacity-15" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(rgba(212,175,55,0.4) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
      </motion.div>

      {/* Gold glow orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-gold/8 blur-[150px]"
          animate={{ scale: [1, 1.1, 1], x: [-20, 20, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      {/* Top/bottom hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />

      <div className="container-custom relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-gold/20">
            <Sparkles size={12} /> Let&apos;s Connect
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-wide leading-tight">
            <span className="text-shimmer">Ready to Transform</span>
            <br />
            <span className="text-white">Your Space?</span>
          </h2>
          <p className="text-brand-text/70 text-base max-w-xl mx-auto font-light leading-relaxed">
            Visit our showroom in Negombo or reach out today. Our team is ready to help you find the perfect lighting and bathware.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {cards.map((card, i) => {
            const isGreen = card.color === "green";
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`group relative bg-brand-charcoal/80 backdrop-blur-sm border rounded-2xl p-7 text-center transition-all duration-300 overflow-hidden ${
                  isGreen ? "border-brand-border hover:border-green-500/40" : "border-brand-border hover:border-gold/40"
                }`}
                style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
              >
                {/* Glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none ${
                  isGreen ? "bg-green-500/4" : "bg-gold/4"
                }`} />

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border transition-all ${
                    isGreen
                      ? "bg-green-500/10 border-green-500/20 group-hover:bg-green-500/20"
                      : "bg-gold/10 border-gold/20 group-hover:bg-gold/20"
                  }`}
                >
                  <card.Icon size={22} className={isGreen ? "text-green-400" : "text-gold"} />
                </motion.div>

                <h3 className="font-semibold text-white text-lg mb-2">{card.title}</h3>
                <p className="text-brand-text/70 text-sm mb-1">{card.line1}</p>
                <p className="text-brand-text/40 text-xs mb-6">{card.line2}</p>

                {card.external ? (
                  <a href={card.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    {card.cta} <ArrowRight size={13} />
                  </a>
                ) : (
                  <Link href={card.href}
                    className="inline-flex items-center gap-2 border border-gold/30 hover:border-gold text-gold text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:bg-gold/10"
                  >
                    {card.cta} <ArrowRight size={13} />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Link href="/contact"
            className="group relative inline-flex items-center gap-3 bg-gold hover:bg-gold-500 text-brand-dark font-bold px-12 py-4.5 rounded-2xl transition-all duration-300 hover:shadow-gold-glow-lg hover:-translate-y-0.5 text-base overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">Request Free Consultation</span>
            <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Hours strip */}
        <div className="border-t border-brand-border/50 pt-8">
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-10">
            {[
              { text: siteSettings.businessHours.weekdays, active: true },
              { text: siteSettings.businessHours.saturday, active: true },
              { text: siteSettings.businessHours.sunday, active: false },
            ].map(({ text, active }) => (
              <div key={text} className={`flex items-center gap-2 text-sm ${active ? "text-brand-text/60" : "text-brand-text/30"}`}>
                <Clock size={13} className={active ? "text-gold" : "text-brand-text/20"} />
                <span className="font-light">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
