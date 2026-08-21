"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, ChevronDown } from "lucide-react";
import { siteSettings } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const slides = [
  {
    badge: "LED Lighting",
    title: "Illuminate Your",
    highlight: "Space",
    titleEnd: " with Style",
    subtitle: "From crystal chandeliers to architectural downlights — premium LED lighting engineered for elegance.",
    image: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=1600&q=90",
    cta: { text: "Explore Lighting", href: "/lighting" },
    accent: "#D4AF37",
    tag: "10+ Years in Sri Lanka",
  },
  {
    badge: "Premium Bathware",
    title: "Redefine Your",
    highlight: "Bathroom",
    titleEnd: " Experience",
    subtitle: "Thermostatic rain showers, smart toilets, waterfall faucets — luxury bathware for discerning homes.",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1600&q=90",
    cta: { text: "Explore Bathware", href: "/bathware" },
    accent: "#D4AF37",
    tag: "9 Product Categories",
  },
  {
    badge: "Showroom, Negombo",
    title: "Visit Our",
    highlight: "Showroom",
    titleEnd: " Today",
    subtitle: "591 Chilaw Road, Kattuwa, Negombo — see our complete range of lighting and bathware in person.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90",
    cta: { text: "Get Directions", href: "/contact" },
    accent: "#D4AF37",
    tag: "Mon–Sat Open",
  },
];

// 3D tilt card component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse parallax on background
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setPrev(current);
      setCurrent(c => (c + 1) % slides.length);
    }, 7000);
    return () => clearInterval(t);
  }, [current]);

  const goTo = (idx: number) => { setPrev(current); setCurrent(idx); };

  const slide = slides[current];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden bg-brand-obsidian">
      {/* ── Parallax background image ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
            style={{ y: bgY, x: mousePos.x, translateY: mousePos.y }}
          >
            <img
              src={slide.image}
              alt={slide.badge}
              className="w-full h-full object-cover scale-110"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian via-brand-obsidian/80 to-brand-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-brand-obsidian/40" />

        {/* Gold light leak from top-right */}
        <motion.div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Diagonal light beams */}
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-gold/20 via-transparent to-transparent -rotate-12 origin-top" />
        <div className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-gold/10 via-transparent to-transparent rotate-6 origin-top" />
      </div>

      {/* ── Floating particles ── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold/40 rounded-full pointer-events-none z-10"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        />
      ))}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 flex-1 flex items-center"
        style={{ y: textY, opacity }}
      >
        <div className="container-custom py-28 md:py-36 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left text */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-md border border-gold/30 rounded-full px-4 py-1.5 mb-8"
                  >
                    <Sparkles size={12} className="text-gold" />
                    <span className="text-[11px] font-bold tracking-[0.25em] text-gold uppercase">{slide.badge}</span>
                    <span className="w-px h-3 bg-gold/30" />
                    <span className="text-[11px] text-brand-text/60">{slide.tag}</span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.0] mb-6 tracking-tight"
                  >
                    <span className="text-white">{slide.title} </span>
                    <span className="relative">
                      {/* 3D layered text effect */}
                      <span className="absolute inset-0 text-transparent"
                        style={{ WebkitTextStroke: "1px rgba(212,175,55,0.3)", transform: "translate(3px, 3px)" }}>
                        {slide.highlight}
                      </span>
                      <span className="relative text-transparent bg-clip-text"
                        style={{ backgroundImage: "linear-gradient(135deg, #B08D27, #D4AF37, #EADDC9, #D4AF37)" }}>
                        {slide.highlight}
                      </span>
                      {/* Underline glow */}
                      <motion.span
                        className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      />
                    </span>
                    <span className="text-white">{slide.titleEnd}</span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-brand-text/80 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 mb-12"
                  >
                    <Link href={slide.cta.href}
                      className="group relative flex items-center gap-2.5 overflow-hidden bg-gold hover:bg-gold-500 text-brand-dark font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-gold-glow-lg hover:-translate-y-0.5"
                    >
                      {/* Shimmer effect */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "200%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative">{slide.cta.text}</span>
                      <ArrowRight size={18} className="relative group-hover:translate-x-1.5 transition-transform" />
                    </Link>

                    <a href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/15 hover:border-gold/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
                    >
                      <Phone size={17} className="text-gold" />
                      <span className="text-sm">{siteSettings.telephone}</span>
                    </a>
                  </motion.div>

                  {/* Trust strip */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center gap-6"
                  >
                    {[
                      { v: "19", l: "Categories" },
                      { v: "34+", l: "Products" },
                      { v: "10+", l: "Years" },
                    ].map(({ v, l }) => (
                      <div key={l} className="flex items-center gap-2">
                        <span className="font-display text-2xl font-bold text-gold">{v}</span>
                        <span className="text-xs text-brand-text/60 uppercase tracking-wider">{l}</span>
                        <span className="w-px h-4 bg-brand-border ml-2 last:hidden" />
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right 3D card */}
            <div className="lg:col-span-5 hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ perspective: 1000 }}
                >
                  <TiltCard className="cursor-pointer">
                    <div className="relative rounded-3xl overflow-hidden border border-gold/20 shadow-2xl"
                      style={{ transform: "translateZ(0)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)" }}>
                      <img
                        src={slide.image}
                        alt={slide.badge}
                        className="w-full h-[420px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/80 via-transparent to-transparent" />

                      {/* Floating info card */}
                      <motion.div
                        className="absolute bottom-5 left-5 right-5 bg-black/40 backdrop-blur-xl border border-gold/20 rounded-2xl p-4"
                        style={{ transform: "translateZ(30px)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gold font-bold uppercase tracking-wider mb-0.5">{slide.badge}</div>
                            <div className="text-white text-sm font-semibold">{slide.cta.text}</div>
                          </div>
                          <Link href={slide.cta.href}
                            className="w-9 h-9 bg-gold hover:bg-gold-500 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <ArrowRight size={16} className="text-brand-dark" />
                          </Link>
                        </div>
                      </motion.div>

                      {/* Corner accent */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-xl flex items-center justify-center">
                        <Sparkles size={14} className="text-gold" />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Slide indicators ── */}
      <div className="relative z-20 flex items-center justify-center gap-6 pb-10">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="group flex items-center gap-2 transition-all duration-300"
              aria-label={`Slide ${i + 1}`}
            >
              <motion.div
                animate={{ width: i === current ? 36 : 8, backgroundColor: i === current ? "#D4AF37" : "rgba(255,255,255,0.3)" }}
                transition={{ duration: 0.4 }}
                className="h-2 rounded-full"
              />
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="text-xs text-brand-text/40 font-mono">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] text-brand-text/30 uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="text-brand-text/30" />
      </motion.div>

      {/* ── Wave divider ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 70L1440 70L1440 25C1200 65 960 5 720 25C480 45 240 5 0 25L0 70Z" fill="#070708" />
        </svg>
      </div>
    </section>
  );
}
