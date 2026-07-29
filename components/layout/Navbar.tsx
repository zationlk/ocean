"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, Sparkles, Heart, GitCompare, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteSettings } from "@/lib/data";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import SearchModal from "@/components/ui/SearchModal";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/products",
    label: "Products",
    children: [
      { href: "/products?category=led-indoor-lighting", label: "LED Indoor Lighting" },
      { href: "/products?category=led-outdoor-lighting", label: "LED Outdoor Lighting" },
      { href: "/products?category=luxury-sanitaryware", label: "Luxury Sanitaryware" },
      { href: "/products?category=designer-showers-faucets", label: "Designer Showers & Faucets" },
      { href: "/products?category=premium-bathtubs", label: "Premium Bathtubs & Jacuzzis" },
      { href: "/products?category=bathroom-accessories", label: "Smart Mirrors & Accessories" },
    ],
  },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Top bar */}
      <div className="bg-brand-dark text-white text-sm py-2 hidden md:block border-b border-white/5">
        <div className="container-custom flex justify-between items-center">
          <span className="text-gold-light text-xs tracking-wider">
            📍 {siteSettings.address}
          </span>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors text-xs"
            >
              <Phone size={12} className="text-gold" />
              <span>{siteSettings.telephone}</span>
            </a>
            <a
              href={`tel:${siteSettings.mobile.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors text-xs"
            >
              <Phone size={12} className="text-gold" />
              <span>{siteSettings.mobile}</span>
            </a>
            <a
              href={`mailto:${siteSettings.email}`}
              className="hover:text-gold transition-colors text-xs"
            >
              {siteSettings.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-brand-obsidian/95 backdrop-blur-md shadow-lg border-b border-brand-border"
            : "bg-brand-obsidian border-b border-brand-border"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold-glow group-hover:shadow-gold-glow-lg transition-all duration-300">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="font-display font-bold text-lg md:text-xl tracking-wider text-white group-hover:text-gold transition-colors leading-none">
                  OCEAN
                </div>
                <div className="text-[9px] text-gold font-semibold tracking-wider uppercase leading-none mt-1">
                  Lighting Solutions
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "nav-link flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "text-gold bg-gold/10"
                        : "text-gray-300 hover:text-gold hover:bg-gold/10"
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === link.label && "rotate-180")} />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-brand-charcoal rounded-xl shadow-card-hover border border-brand-border overflow-hidden z-50 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-3 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold transition-colors border-b border-brand-border last:border-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-text/60 hover:text-gold hover:bg-gold/10 border border-brand-border hover:border-gold/30 transition-all text-xs"
                aria-label="Search"
              >
                <Search size={16} />
                <span className="hidden xl:inline">Search</span>
                <kbd className="hidden xl:inline text-[10px] bg-brand-obsidian border border-brand-border rounded px-1.5 py-0.5 text-brand-text/40">⌘K</kbd>
              </button>
              {/* Wishlist icon */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/10 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              {/* Compare icon */}
              {compareItems.length > 0 && (
                <Link
                  href="/compare"
                  className="relative p-2.5 rounded-lg text-gray-300 hover:text-gold hover:bg-gold/10 transition-colors"
                  aria-label="Compare"
                >
                  <GitCompare size={20} />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-primary text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                    {compareItems.length}
                  </span>
                </Link>
              )}
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="bg-brand-primary hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-gold-glow"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-gold/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="lg:hidden bg-brand-obsidian border-t border-brand-border shadow-lg animate-slide-up">
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-gold bg-gold/10"
                        : "text-gray-300 hover:text-gold hover:bg-gold/10"
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => { setIsMobileOpen(false); setSearchOpen(true); }}
                  className="flex items-center justify-center gap-2 border border-brand-border text-brand-text hover:border-gold/30 hover:text-gold font-semibold py-3 rounded-lg transition-colors"
                >
                  <Search size={18} /> Search Products
                </button>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-lg"
                >
                  WhatsApp Us
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center bg-brand-primary text-white font-semibold py-3 rounded-lg"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
