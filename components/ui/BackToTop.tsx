"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      setProgress(pct);
      setVisible(scrolled > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-24 right-5 z-40 w-12 h-12 flex items-center justify-center",
        "bg-brand-charcoal rounded-full transition-all duration-300 hover:-translate-y-1",
        "border border-brand-border hover:border-gold/50 hover:shadow-gold-glow"
      )}
      aria-label="Back to top"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r={r} stroke="#1D1D22" strokeWidth="2.5" />
        <circle
          cx="24" cy="24" r={r}
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-200"
        />
      </svg>
      <ChevronUp size={18} className="text-gold relative z-10" />
    </button>
  );
}
