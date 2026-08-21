"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Package, Users, Globe } from "lucide-react";

const stats = [
  { end: 10,   suffix: "+", label: "Years",     sub: "In business",          Icon: Trophy,  color: "text-gold" },
  { end: 34,   suffix: "+", label: "Products",  sub: "In our catalogue",     Icon: Package, color: "text-blue-400" },
  { end: 1000, suffix: "+", label: "Customers", sub: "Served island-wide",   Icon: Users,   color: "text-green-400" },
  { end: 19,   suffix: "",  label: "Categories", sub: "Lighting & bathware", Icon: Globe,   color: "text-purple-400" },
];

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 1800 / 60);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Full-bleed gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian via-[#1a1508] to-brand-obsidian" />
      <div className="absolute inset-0 bg-gold-gradient opacity-20" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-60 h-60 bg-gold/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Top/bottom gold borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-gold/15">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center px-6 py-4 group"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:border-gold/30 transition-all duration-300"
              >
                <stat.Icon size={24} className={stat.color} />
              </motion.div>

              {/* Number */}
              <div className="font-display text-5xl md:text-6xl font-bold text-white mb-1 leading-none glow-text">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-gold font-semibold text-sm tracking-wider uppercase mb-1">{stat.label}</div>
              <div className="text-brand-text/50 text-xs font-light">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
