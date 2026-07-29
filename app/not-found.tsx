import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gold/20">
          <Sparkles size={36} className="text-gold" />
        </div>
        <h1 className="font-display text-8xl font-bold mb-4 glow-text">404</h1>
        <h2 className="text-2xl font-semibold mb-3 tracking-wide">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto font-light">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-brand-dark font-bold px-6 py-3 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-brand-primary hover:bg-gold-600 text-brand-dark font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
