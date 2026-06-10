"use client";

import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompareBar() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-brand-primary shadow-2xl",
        "animate-slide-up"
      )}
    >
      <div className="container-custom py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompare size={18} className="text-brand-primary" />
            <span className="text-sm font-semibold text-gray-900">
              Compare ({items.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-brand-bg rounded-xl px-3 py-2 border border-brand-border"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-sm text-gray-900 max-w-[140px] truncate font-medium">
                  {item.name}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  aria-label="Remove from compare"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - items.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-dashed border-gray-300"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">+</span>
                </div>
                <span className="text-sm text-gray-400">Add product</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors px-3 py-2"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className={cn(
                "flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300",
                items.length >= 2
                  ? "bg-brand-primary hover:bg-brand-dark text-white hover:shadow-teal-glow"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
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
