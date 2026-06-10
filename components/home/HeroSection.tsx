"use client";

import Link from "next/link";
import { ArrowRight, Phone, Star, Shield, Zap } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large glow orb top right */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl animate-float" />
        {/* Medium glow orb bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-teal-400/10 blur-3xl" style={{ animationDelay: "2s" }} />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0,160,160,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,160,160,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Diagonal light beam */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-teal-400/30 via-transparent to-transparent transform -rotate-12 origin-top" />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-teal-200">
                Sri Lanka&apos;s Premium Lighting Destination
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Illuminate Your{" "}
              <span className="relative">
                <span className="text-teal-300 glow-text">World</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-transparent" />
              </span>{" "}
              with Premium LED Solutions
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              {siteSettings.tagline}. Transform your space with elegance and energy efficiency.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { icon: Shield, text: "Quality Guaranteed" },
                { icon: Zap, text: "Energy Efficient" },
                { icon: Star, text: "Premium Brands" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-teal-200">
                  <Icon size={14} className="text-teal-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-7 py-4 rounded-xl transition-all duration-300 hover:shadow-teal-glow-lg hover:-translate-y-0.5"
              >
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-4 rounded-xl transition-all duration-300"
              >
                <Phone size={18} />
                {siteSettings.telephone}
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative hidden lg:block">
            {/* Main visual card */}
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-teal-500/20 blur-2xl scale-110" />

              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                  alt="Premium LED Lighting"
                  className="w-full h-[500px] object-cover"
                  loading="eager"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Premium Collection</div>
                      <div className="text-teal-300 text-sm">500+ Products Available</div>
                    </div>
                    <Link
                      href="/products"
                      className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-brand-primary" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg leading-none">70%</div>
                  <div className="text-xs text-brand-text">Energy Savings</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg leading-none">5 Yr</div>
                  <div className="text-xs text-brand-text">Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
