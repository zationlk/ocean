"use client";

import { Shield, Award, Truck, HeadphonesIcon, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Premium Imports",
    description:
      "We source only the finest LED lighting and luxury bathware products from elite international manufacturers.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
  {
    icon: Shield,
    title: "Warranty Assured",
    description:
      "All our fixtures, fittings, and smart components come with comprehensive manufacturer warranties.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
  {
    icon: Zap,
    title: "Eco-Innovation",
    description:
      "Our smart LED lighting and modern sanitaryware focus on extreme energy savings and water efficiency.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
  {
    icon: Truck,
    title: "Safe Island Delivery",
    description:
      "We deliver across Sri Lanka, guaranteeing that delicate glass chandeliers and bath ceramics arrive safely.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Architectural Advisory",
    description:
      "Our design consultants offer expert guidance to plan custom lighting layouts and sanitary setups.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
  {
    icon: Star,
    title: "Signature Prestige",
    description:
      "Years of experience furnishing premium residences, luxury hotels, and commercial spaces.",
    color: "bg-gold/10 text-gold border border-gold/20",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-bg relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover border border-brand-border">
              <img
                src="https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"
                alt="Why Choose OCEAN Lighting Solutions"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/40 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-brand-charcoal rounded-2xl shadow-card border border-brand-border p-6 max-w-[220px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
                  <Award size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">10+ Years</div>
                  <div className="text-xs text-brand-text">Prestige</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-xs text-brand-text mt-1">First-class customer reviews</p>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-gradient rounded-2xl opacity-10 rotate-12" />
          </motion.div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-brand-primary text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4 shadow-sm border border-gold/20">
              <span>Why Choose Us</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              Your Premier Luxury Interiors Partner
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-brand-text mb-10 leading-relaxed font-light text-sm md:text-base">
              OCEAN Lighting Solutions has been transforming living spaces across Sri Lanka with signature imports. We merge state-of-the-art engineering with sophisticated aesthetics to provide fixtures that are built to perform and styled to inspire, featuring the elite OCEANA bathware collections.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-4 bg-brand-charcoal rounded-xl border border-brand-border hover:border-gold/30 hover:shadow-card transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-brand-text font-light leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
