"use client";

import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-charcoal border-t border-gold/30 shadow-gold-glow animate-slide-up">
      <div className="container-custom py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompare size={17} className="text-gold" />
            <span className="text-sm font-semibold text-gold tracking-wide">Compare</span>
            <span className="text-sm text-brand-text">({items.length}/3)</span>
          </div>

          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-brand-obsidian rounded-xl px-3 py-2 border border-brand-border"
              >
                <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-sm text-white max-w-[140px] truncate font-medium">{item.name}</span>
                <button
                  onClick={() => remove(item.id)}
                  className="text-brand-text/50 hover:text-red-400 transition-colors ml-1"
                  aria-label="Remove from compare"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - items.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2 bg-brand-obsidian rounded-xl px-3 py-2 border border-dashed border-brand-border"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-charcoal border border-brand-border flex items-center justify-center">
                  <span className="text-brand-text/40 text-xs">+</span>
                </div>
                <span className="text-sm text-brand-text/50">Add product</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="text-sm text-brand-text/50 hover:text-red-400 font-medium transition-colors px-3 py-2"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className={cn(
                "flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300",
                items.length >= 2
                  ? "bg-gold hover:bg-gold-600 text-brand-dark hover:shadow-gold-glow"
                  : "bg-brand-obsidian text-brand-text/40 cursor-not-allowed pointer-events-none border border-brand-border"
              )}
            >
              <GitCompare size={16} />
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
