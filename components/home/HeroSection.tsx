"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Phone, Star, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { siteSettings } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    badge: "OCEAN LIGHTING SOLUTIONS",
    title: "Illuminate Your Spaces with Premium LED Design",
    subtitle: "From handcrafted crystal chandeliers to sleek architectural downlights — transform your interiors with light engineered for elegance.",
    image: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=1200&q=80",
    ctaText: "Explore Lighting",
    ctaLink: "/products?category=indoor-lighting",
    highlight: "Light",
  },
  {
    badge: "PREMIUM BATHWARE",
    title: "Elevate Your Bathroom with Designer Bathware",
    subtitle: "Discover thermostatic rain showers, smart rimless toilets, waterfall faucets and luxury vanity units — all under one roof.",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&q=80",
    ctaText: "Explore Bathware",
    ctaLink: "/products?category=showers",
    highlight: "Bathroom",
  },
  {
    badge: "OCEAN LIGHTING SOLUTIONS",
    title: "Crafting Perfect Living Environments",
    subtitle: "Sri Lanka's trusted destination for LED lighting, electrical items, and premium bathware. Visit our showroom in Negombo.",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
    ctaText: "View Gallery",
    ctaLink: "/gallery",
    highlight: "Living",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  const currentData = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-obsidian">
      {/* Animated background particles/orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-3xl" style={{ animationDelay: "2.5s" }} />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Diagonal light reflection beam */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-gold/25 via-transparent to-transparent transform -rotate-12 origin-top" />
      </div>

      {/* Slide Image Background with smooth scale transition */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={currentData.image}
              alt="Ocean Lighting Solutions"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Elegant dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian via-brand-obsidian/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-brand-obsidian/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container-custom relative z-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Slide Text Content */}
          <div className="lg:col-span-8 text-white">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gold/15 backdrop-blur-md border border-gold/30 rounded-full px-4.5 py-1.5 mb-8 shadow-gold-glow">
                  <Sparkles size={13} className="text-gold animate-spin-slow" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                    {currentData.badge}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-wide">
                  {currentData.title.split(currentData.highlight)[0]}
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">
                    {currentData.highlight}
                    <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-gold/60 to-transparent rounded-full" />
                  </span>
                  {currentData.title.split(currentData.highlight)[1]}
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl font-light">
                  {currentData.subtitle}
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-6 mb-12">
                  {[
                    { icon: Shield, text: "Manufacturer Warranty" },
                    { icon: Star, text: "Curated Global Brands" },
                    { icon: Sparkles, text: "Bespoke Design Advisory" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-gold-light tracking-wide font-medium">
                      <Icon size={14} className="text-gold" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA actions */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={currentData.ctaLink}
                    className="group flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold hover:from-gold hover:to-gold-light text-brand-dark font-bold px-8 py-4.5 rounded-xl transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5"
                  >
                    {currentData.ctaText}
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                  <a
                    href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-semibold px-8 py-4.5 rounded-xl transition-all duration-300"
                  >
                    <Phone size={18} className="text-gold" />
                    <span>{siteSettings.telephone}</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 right-10 z-20 hidden md:flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-gold hover:border-gold hover:text-brand-dark flex items-center justify-center text-white transition-all duration-300"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-gold hover:border-gold hover:text-brand-dark flex items-center justify-center text-white transition-all duration-300"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-10 bg-gold" : "w-2.5 bg-white/30 hover:bg-white/55"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#070708" />
        </svg>
      </div>
    </section>
  );
}
