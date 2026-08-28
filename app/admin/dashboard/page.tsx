"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package, MessageSquare, FolderOpen, Settings,
  Eye, ArrowRight, Star, TrendingUp, ArrowUpRight, Users, Quote, Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/lib/types";

const LIGHTING_SLUGS = new Set([
  "indoor-lighting","outdoor-lighting","commercial-lighting","led-bulbs",
  "led-tube-lights","led-ceiling-lights","led-strip-lighting",
  "led-mirror-lights","led-step-lights","electrical-items",
]);

interface Product {
  id: string; name: string; slug: string; category: string;
  shortDescription?: string; short_description?: string; description?: string;
  images: string[]; isFeatured?: boolean; isNew?: boolean;
  is_featured?: boolean; is_new?: boolean; badge?: string;
  createdAt?: string;
}

function normalise(p: Product): Product {
  return {
    ...p,
    isFeatured: !!(p.isFeatured ?? p.is_featured),
    isNew:      !!(p.isNew      ?? p.is_new),
    shortDescription: p.shortDescription || p.short_description || "",
    images: Array.isArray(p.images) ? p.images : [],
  };
}

export default function AdminDashboardPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resP, resC] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      if (resP.ok) {
        const raw = await resP.json();
        setProducts(Array.isArray(raw) ? raw.map(normalise) : []);
      }
      if (resC.ok) {
        const rawC = await resC.json();
        setCategories(Array.isArray(rawC) ? rawC : []);
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const lightingCount = products.filter(p => LIGHTING_SLUGS.has(p.category)).length;
  const bathwareCount = products.filter(p => !LIGHTING_SLUGS.has(p.category)).length;

  const statCards = [
    {
      label: "Total Products",
      value: products.length,
      sub: "In catalogue",
      icon: Package,
      iconBg: "bg-blue-500/10 text-blue-400",
      trend: "+4 this month",
      href: "/admin/products",
    },
    {
      label: "Categories",
      value: categories.length,
      sub: `${categories.filter(c => LIGHTING_SLUGS.has(c.slug)).length} Lighting · ${categories.filter(c => !LIGHTING_SLUGS.has(c.slug)).length} Bathware`,
      icon: FolderOpen,
      iconBg: "bg-gold/10 text-gold",
      trend: null,
      href: "/admin/categories",
    },
    {
      label: "Featured Products",
      value: products.filter(p => p.isFeatured).length,
      sub: "Shown on homepage",
      icon: Star,
      iconBg: "bg-amber-500/10 text-amber-400",
      trend: null,
      href: "/admin/products",
    },
    {
      label: "New Arrivals",
      value: products.filter(p => p.isNew).length,
      sub: "Recently added",
      icon: TrendingUp,
      iconBg: "bg-green-500/10 text-green-400",
      trend: null,
      href: "/admin/products",
    },
  ];

  const quickActions = [
    { href: "/admin/products/new", label: "Add New Product", icon: Package, iconBg: "bg-blue-500/10 text-blue-400" },
    { href: "/admin/categories", label: "Manage Categories", icon: FolderOpen, iconBg: "bg-gold/10 text-gold" },
    { href: "/admin/testimonials", label: "Testimonials", icon: Quote, iconBg: "bg-amber-500/10 text-amber-400" },
    { href: "/admin/brands", label: "Partner Brands", icon: Award, iconBg: "bg-green-500/10 text-green-400" },
    { href: "/admin/inquiries", label: "View Inquiries", icon: MessageSquare, iconBg: "bg-cyan-500/10 text-cyan-400" },
    { href: "/admin/settings", label: "Site Settings", icon: Settings, iconBg: "bg-purple-500/10 text-purple-400" },
  ];

  if (loading) return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg, #8C6E1C 0%, #D4AF37 60%, #B08D27 100%)" }}>
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-1">Welcome back, Admin 👋</h2>
            <p className="text-brand-dark/70 text-sm font-light">Ocean Lighting Solutions · Manage your store</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-[#0d0d10] rounded-2xl border border-white/6 p-5">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/30 mt-3 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg, #8C6E1C 0%, #D4AF37 60%, #B08D27 100%)" }}>
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-1">Welcome back, Admin 👋</h2>
            <p className="text-brand-dark/70 text-sm font-light">Ocean Lighting Solutions · Manage your store</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-brand-dark">
            <div className="text-center">
              <div className="text-2xl font-bold">{lightingCount}</div>
              <div className="text-xs font-semibold opacity-70">Lighting</div>
            </div>
            <div className="w-px h-10 bg-brand-dark/20" />
            <div className="text-center">
              <div className="text-2xl font-bold">{bathwareCount}</div>
              <div className="text-xs font-semibold opacity-70">Bathware</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="group bg-[#0d0d10] rounded-2xl border border-white/6 p-5 hover:border-gold/25 transition-all duration-200"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={18} />
              </div>
              <ArrowUpRight size={15} className="text-white/15 group-hover:text-gold/60 transition-colors" />
            </div>
            <div className="font-bold text-3xl text-white leading-none mb-1">{stat.value}</div>
            <div className="text-sm text-white/60 font-medium">{stat.label}</div>
            <div className="text-[11px] text-white/30 mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent products */}
        <div className="lg:col-span-2 bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white text-sm">Recent Products</h3>
            <Link href="/admin/products" className="text-xs text-gold/70 hover:text-gold flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/4">
            {products.slice(0, 6).length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Package size={28} className="mx-auto mb-2 text-white/10" />
                <p className="text-white/30 text-sm">No products yet</p>
              </div>
            ) : products.slice(0, 6).map(product => (
              <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors group">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-bg shrink-0">
                  <img src={product.images?.[0] || ""} alt={product.name} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=80&q=60"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                    {product.name}
                  </div>
                  <div className="text-[11px] text-white/30 capitalize">{product.category?.replace(/-/g, " ")}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {product.isFeatured && (
                    <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/15">
                      Featured
                    </span>
                  )}
                  {product.isNew && (
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/15">
                      New
                    </span>
                  )}
                  <Link href={`/products/${product.slug}`} target="_blank"
                    className="p-1.5 text-white/20 hover:text-gold hover:bg-gold/8 rounded-lg transition-colors">
                    <Eye size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-0.5">
              {quickActions.map(action => (
                <Link key={action.href} href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
                  <div className={`w-8 h-8 ${action.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <action.icon size={15} />
                  </div>
                  <span className="text-sm text-white/50 group-hover:text-white transition-colors flex-1">
                    {action.label}
                  </span>
                  {(action as any).badge && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {(action as any).badge}
                    </span>
                  )}
                  <ArrowRight size={13} className="text-white/15 group-hover:text-white/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Catalogue breakdown */}
          <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-5"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Users size={15} className="text-gold/60" /> Catalogue Split
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50">Lighting & Electrical</span>
                  <span className="text-xs font-bold text-white">{lightingCount}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${products.length > 0 ? (lightingCount / products.length) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50">Bathware & Plumbing</span>
                  <span className="text-xs font-bold text-white">{bathwareCount}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${products.length > 0 ? (bathwareCount / products.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
