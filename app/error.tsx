"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-obsidian flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/4 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-lg w-full"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <AlertTriangle size={36} className="text-red-400" />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide mb-3">
          Something went wrong
        </h1>
        <p className="text-brand-text/60 font-light mb-2 text-sm leading-relaxed">
          An unexpected error occurred. Our team has been notified. You can try
          again or return to the homepage.
        </p>
        {error.digest && (
          <p className="text-brand-text/30 text-xs mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={reset}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-6 py-3 rounded-xl transition-all hover:shadow-gold-glow"
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
