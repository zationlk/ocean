"use client";

import { Shield, Award, Truck, HeadphonesIcon, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Award,          title: "Premium Quality",         description: "Every product meets strict international quality standards — from LED fittings to ceramic bathroom suites.", color: "from-gold/20 to-gold/5",    iconBg: "bg-gold/15 text-gold border-gold/25" },
  { icon: Shield,         title: "Warranty Assured",        description: "All our fixtures and fittings come with comprehensive manufacturer warranty support.",                    color: "from-blue-500/10 to-blue-500/5", iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { icon: Zap,            title: "Energy Efficient",        description: "Our LED solutions save up to 70% on electricity compared to traditional lighting systems.",               color: "from-amber-500/10 to-amber-500/5", iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { icon: Truck,          title: "Island-Wide Delivery",    description: "Safe, reliable delivery across Sri Lanka — from Negombo to Colombo, Kandy and beyond.",                  color: "from-green-500/10 to-green-500/5", iconBg: "bg-green-500/10 text-green-400 border-green-500/20" },
  { icon: HeadphonesIcon, title: "Expert Advice",           description: "Our knowledgeable team helps you choose the right products for your space and budget.",                  color: "from-purple-500/10 to-purple-500/5", iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { icon: Star,           title: "Trusted Since 2014",      description: "Over a decade serving homes, hotels, offices and commercial projects across Sri Lanka.",                  color: "from-gold/20 to-gold/5",    iconBg: "bg-gold/15 text-gold border-gold/25" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-bg relative overflow-hidden">
      {/* Bg decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[120px] orb-float" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px]" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Main image with 3D tilt feel */}
            <div className="relative rounded-3xl overflow-hidden border border-brand-border group">
              <img
                src="https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"
                alt="Ocean Lighting Solutions Showroom"
                className="w-full h-[520px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-obsidian/50 via-transparent to-transparent" />

              {/* Overlay badge */}
              <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl border border-gold/20 rounded-2xl px-4 py-3">
                <div className="text-xs text-gold font-bold uppercase tracking-wider">Ocean Lighting</div>
                <div className="text-white text-sm font-semibold mt-0.5">Negombo Showroom</div>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-brand-charcoal border border-gold/20 rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
                  <Award size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-xl leading-none">10+</div>
                  <div className="text-xs text-brand-text">Years</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-gold fill-gold" />)}
              </div>
              <p className="text-[10px] text-brand-text/60">Trusted across Sri Lanka</p>
            </motion.div>

            {/* Decorative corner accent */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 rotate-12" />
          </motion.div>

          {/* ── Right Content ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-5 border border-gold/20">
                Why Choose Us
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wide leading-tight">
                Your Trusted Partner for{" "}
                <span className="text-shimmer">Lighting & Bathware</span>
              </h2>
              <div className="section-divider mb-6" />
              <p className="text-brand-text/80 mb-10 leading-relaxed font-light text-sm md:text-base">
                Ocean Lighting Solutions brings together premium LED lighting and quality bathware under one roof — with the expertise, range, and service to match every project.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className={`relative flex gap-3.5 p-4 bg-gradient-to-br ${feature.color} bg-brand-charcoal rounded-2xl border border-brand-border hover:border-gold/30 transition-all duration-300 group hover-lift overflow-hidden`}
                >
                  {/* Hover shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    whileHover={{ x: ["−100%", "200%"] }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className={`w-9 h-9 ${feature.iconBg} rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform`}>
                    <feature.icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                    <p className="text-[11px] text-brand-text/70 font-light leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
