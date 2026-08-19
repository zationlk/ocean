"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Phone, ChevronDown, Heart, GitCompare, Search,
  Lightbulb, Droplets, Home, Images, Building2, Info, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import SearchModal from "@/components/ui/SearchModal";
import Image from "next/image";

const LIGHTING_CATS = [
  { href: "/lighting?category=indoor-lighting",    label: "Indoor Lighting",     icon: "💡" },
  { href: "/lighting?category=outdoor-lighting",   label: "Outdoor Lighting",    icon: "🌿" },
  { href: "/lighting?category=commercial-lighting",label: "Commercial Lighting", icon: "🏢" },
  { href: "/lighting?category=led-bulbs",          label: "LED Bulbs",           icon: "🔆" },
  { href: "/lighting?category=led-tube-lights",    label: "LED Tube Lights",     icon: "📏" },
  { href: "/lighting?category=led-ceiling-lights", label: "LED Ceiling Lights",  icon: "⭕" },
  { href: "/lighting?category=led-strip-lighting", label: "LED Strip Lighting",  icon: "〰️" },
  { href: "/lighting?category=led-mirror-lights",  label: "LED Mirror Lights",   icon: "🔲" },
  { href: "/lighting?category=led-step-lights",    label: "LED Step Lights",     icon: "🪜" },
  { href: "/lighting?category=electrical-items",   label: "Electrical Items",    icon: "⚡" },
];

const BATHWARE_CATS = [
  { href: "/bathware?category=toilets",               label: "Toilets (WC)",           icon: "🚽" },
  { href: "/bathware?category=wash-basins",           label: "Wash Basins",            icon: "🪣" },
  { href: "/bathware?category=faucets-mixers",        label: "Faucets & Mixers",       icon: "🚰" },
  { href: "/bathware?category=showers",               label: "Showers",                icon: "🚿" },
  { href: "/bathware?category=bathroom-accessories",  label: "Bathroom Accessories",   icon: "🧴" },
  { href: "/bathware?category=bathroom-mirrors",      label: "Bathroom Mirrors",       icon: "🪞" },
  { href: "/bathware?category=vanity-units",          label: "Vanity Units",           icon: "🗄️" },
  { href: "/bathware?category=kitchen-sinks-faucets", label: "Kitchen Sinks & Faucets",icon: "🍽️" },
  { href: "/bathware?category=plumbing-accessories",  label: "Plumbing Accessories",   icon: "🔧" },
];

export default function Navbar() {
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [isMobileOpen,   setIsMobileOpen]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string|null>(null);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string|null>(null);

  const pathname = usePathname();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems }  = useCompare();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); setMobileExpanded(null); }, [pathname]);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isLightingActive = pathname.startsWith("/lighting") || (pathname === "/products" && false);
  const isBathwareActive = pathname.startsWith("/bathware");

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Top bar ── */}
      <div className="bg-brand-dark text-white py-2 hidden lg:block border-b border-white/5">
        <div className="container-custom flex justify-between items-center">
          <span className="text-brand-text/60 text-xs tracking-wide flex items-center gap-1.5">
            <span className="text-gold text-xs">📍</span>
            {siteSettings.address}
          </span>
          <div className="flex items-center gap-5 text-xs">
            <a href={`tel:${siteSettings.telephone.replace(/\s/g,"")}`} className="flex items-center gap-1.5 text-brand-text/70 hover:text-gold transition-colors">
              <Phone size={11} className="text-gold" />{siteSettings.telephone}
            </a>
            <a href={`tel:${siteSettings.mobile.replace(/\s/g,"")}`} className="flex items-center gap-1.5 text-brand-text/70 hover:text-gold transition-colors">
              <Phone size={11} className="text-gold" />{siteSettings.mobile}
            </a>
            <a href={`mailto:${siteSettings.email}`} className="text-brand-text/70 hover:text-gold transition-colors">
              {siteSettings.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-brand-obsidian/96 backdrop-blur-lg shadow-xl border-b border-brand-border"
          : "bg-brand-obsidian border-b border-brand-border"
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {/* PNG logo if available, otherwise text fallback */}
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gold-gradient flex items-center justify-center shadow-gold-glow group-hover:shadow-gold-glow-lg transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Ocean Lighting Solutions"
                  width={36}
                  height={36}
                  className="object-contain"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  priority
                />
                {/* Fallback text if no logo */}
                <span className="font-display font-bold text-white text-sm absolute select-none" aria-hidden="true">O</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-base md:text-lg tracking-wider text-white group-hover:text-gold transition-colors leading-none">
                  Ocean Lighting
                </div>
                <div className="text-[9px] text-gold/80 font-semibold tracking-[0.15em] uppercase leading-none mt-0.5">
                  Solutions
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

              {/* Home */}
              <Link href="/" className={cn("nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200", pathname === "/" ? "text-gold bg-gold/10" : "text-brand-text/70 hover:text-gold hover:bg-gold/8")}>
                <Home size={14} /> Home
              </Link>

              {/* Lighting mega-menu */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("lighting")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href="/lighting" className={cn("nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200", isLightingActive ? "text-gold bg-gold/10" : "text-brand-text/70 hover:text-gold hover:bg-gold/8")}>
                  <Lightbulb size={14} /> Lighting
                  <ChevronDown size={13} className={cn("transition-transform duration-200", activeDropdown === "lighting" ? "rotate-180 text-gold" : "")} />
                </Link>
                {activeDropdown === "lighting" && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-brand-charcoal rounded-2xl shadow-2xl border border-brand-border overflow-hidden z-50 animate-fade-in">
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest px-3 py-2">Lighting & Electrical</div>
                      {LIGHTING_CATS.map(c => (
                        <Link key={c.href} href={c.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-brand-text/80 hover:bg-gold/10 hover:text-gold transition-all group/item"
                        >
                          <span className="text-base w-5 text-center">{c.icon}</span>
                          <span>{c.label}</span>
                        </Link>
                      ))}
                      <div className="border-t border-brand-border mt-2 pt-2 px-3 pb-1">
                        <Link href="/lighting" className="text-xs text-gold font-semibold hover:underline">View all lighting →</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bathware mega-menu */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("bathware")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href="/bathware" className={cn("nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200", isBathwareActive ? "text-gold bg-gold/10" : "text-brand-text/70 hover:text-gold hover:bg-gold/8")}>
                  <Droplets size={14} /> Bathware
                  <ChevronDown size={13} className={cn("transition-transform duration-200", activeDropdown === "bathware" ? "rotate-180 text-gold" : "")} />
                </Link>
                {activeDropdown === "bathware" && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-brand-charcoal rounded-2xl shadow-2xl border border-brand-border overflow-hidden z-50 animate-fade-in">
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest px-3 py-2">Bathware & Plumbing</div>
                      {BATHWARE_CATS.map(c => (
                        <Link key={c.href} href={c.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-brand-text/80 hover:bg-gold/10 hover:text-gold transition-all group/item"
                        >
                          <span className="text-base w-5 text-center">{c.icon}</span>
                          <span>{c.label}</span>
                        </Link>
                      ))}
                      <div className="border-t border-brand-border mt-2 pt-2 px-3 pb-1">
                        <Link href="/bathware" className="text-xs text-gold font-semibold hover:underline">View all bathware →</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {[
                { href: "/projects", label: "Projects",  Icon: Building2 },
                { href: "/gallery",  label: "Gallery",   Icon: Images },
                { href: "/about",    label: "About",     Icon: Info },
                { href: "/contact",  label: "Contact",   Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <Link key={href} href={href}
                  className={cn("nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === href ? "text-gold bg-gold/10" : "text-brand-text/70 hover:text-gold hover:bg-gold/8"
                  )}
                >
                  <Icon size={14} /> {label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              {/* Search icon button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-brand-text/60 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all group"
                aria-label="Search (⌘K)"
                title="Search (⌘K)"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2.5 rounded-xl text-brand-text/60 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all" aria-label="Wishlist">
                <Heart size={18} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Compare */}
              {compareItems.length > 0 && (
                <Link href="/compare" className="relative p-2.5 rounded-xl text-brand-text/60 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all" aria-label="Compare">
                  <GitCompare size={18} />
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-gold text-brand-dark text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {compareItems.length}
                  </span>
                </Link>
              )}

              {/* Get Quote CTA */}
              <Link
                href="/contact"
                className="ml-1 bg-gold hover:bg-gold-600 text-brand-dark text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-gold-glow whitespace-nowrap"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile: search + menu */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg text-brand-text/60 hover:text-gold hover:bg-gold/10 transition-colors" aria-label="Search">
                <Search size={20} />
              </button>
              <button onClick={() => setIsMobileOpen(o => !o)} className="p-2 rounded-lg text-brand-text/60 hover:text-gold hover:bg-gold/10 transition-colors" aria-label="Toggle menu">
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {isMobileOpen && (
          <div className="lg:hidden bg-brand-obsidian border-t border-brand-border shadow-xl animate-slide-up">
            <div className="container-custom py-4 space-y-0.5">
              <Link href="/" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors", pathname === "/" ? "text-gold bg-gold/10" : "text-brand-text/80 hover:text-gold hover:bg-gold/8")}>
                <Home size={16} /> Home
              </Link>

              {/* Lighting accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(e => e === "lighting" ? null : "lighting")}
                  className={cn("w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors", isLightingActive ? "text-gold bg-gold/10" : "text-brand-text/80 hover:text-gold hover:bg-gold/8")}
                >
                  <span className="flex items-center gap-3"><Lightbulb size={16} /> Lighting</span>
                  <ChevronDown size={14} className={cn("transition-transform", mobileExpanded === "lighting" ? "rotate-180 text-gold" : "")} />
                </button>
                {mobileExpanded === "lighting" && (
                  <div className="ml-4 mt-0.5 space-y-0.5 pb-1">
                    <Link href="/lighting" className="block px-4 py-2 text-sm text-gold font-semibold hover:bg-gold/10 rounded-xl transition-colors">All Lighting & Electrical →</Link>
                    {LIGHTING_CATS.map(c => (
                      <Link key={c.href} href={c.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text/70 hover:text-gold hover:bg-gold/8 rounded-xl transition-colors">
                        <span>{c.icon}</span>{c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Bathware accordion */}
              <div>
                <button
                  onClick={() => setMobileExpanded(e => e === "bathware" ? null : "bathware")}
                  className={cn("w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors", isBathwareActive ? "text-gold bg-gold/10" : "text-brand-text/80 hover:text-gold hover:bg-gold/8")}
                >
                  <span className="flex items-center gap-3"><Droplets size={16} /> Bathware</span>
                  <ChevronDown size={14} className={cn("transition-transform", mobileExpanded === "bathware" ? "rotate-180 text-gold" : "")} />
                </button>
                {mobileExpanded === "bathware" && (
                  <div className="ml-4 mt-0.5 space-y-0.5 pb-1">
                    <Link href="/bathware" className="block px-4 py-2 text-sm text-gold font-semibold hover:bg-gold/10 rounded-xl transition-colors">All Bathware & Plumbing →</Link>
                    {BATHWARE_CATS.map(c => (
                      <Link key={c.href} href={c.href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-text/70 hover:text-gold hover:bg-gold/8 rounded-xl transition-colors">
                        <span>{c.icon}</span>{c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {[
                { href: "/projects", label: "Projects",  Icon: Building2 },
                { href: "/gallery",  label: "Gallery",   Icon: Images },
                { href: "/about",    label: "About",     Icon: Info },
                { href: "/contact",  label: "Contact",   Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <Link key={href} href={href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors", pathname === href ? "text-gold bg-gold/10" : "text-brand-text/80 hover:text-gold hover:bg-gold/8")}>
                  <Icon size={16} /> {label}
                </Link>
              ))}

              {/* Bottom mobile CTAs */}
              <div className="pt-3 border-t border-brand-border space-y-2">
                <div className="flex gap-2">
                  <Link href="/wishlist" className="flex-1 flex items-center justify-center gap-2 bg-brand-charcoal border border-brand-border text-white text-sm font-semibold py-2.5 rounded-xl hover:border-gold/30 hover:text-gold transition-all">
                    <Heart size={16} /> Wishlist {wishlistItems.length > 0 && <span className="bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
                  </Link>
                  <Link href="/contact" className="flex-1 flex items-center justify-center bg-gold text-brand-dark font-bold text-sm py-2.5 rounded-xl hover:bg-gold-600 transition-all hover:shadow-gold-glow">
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
