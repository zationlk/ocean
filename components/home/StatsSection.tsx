"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Package, Users, Globe } from "lucide-react";

const stats = [
  { end: 10, suffix: "+", label: "Years Experience", description: "Serving luxury spaces across Sri Lanka", Icon: Trophy },
  { end: 500, suffix: "+", label: "Products", description: "Premium curated collections", Icon: Package },
  { end: 1000, suffix: "+", label: "Happy Customers", description: "Island-wide satisfied clientele", Icon: Users },
  { end: 50, suffix: "+", label: "Brand Partners", description: "World-class global partnerships", Icon: Globe },
];

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-brand-charcoal border-y border-gold/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/15">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center px-6 py-4 flex flex-col items-center gap-3 ${
                index < 2 ? "border-b border-gold/15 lg:border-b-0" : ""
              }`}
            >
              <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center animate-float">
                <stat.Icon size={20} className="text-gold" />
              </div>
              <div className="font-display text-4xl md:text-5xl font-bold text-gold leading-none">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="font-semibold text-white text-sm tracking-wide">{stat.label}</div>
              <div className="text-brand-text text-xs font-light leading-relaxed max-w-[140px]">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
