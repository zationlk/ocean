import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Zap size={36} className="text-teal-300" />
        </div>
        <h1 className="font-display text-8xl font-bold mb-4 glow-text">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-teal-200 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white text-brand-primary font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
