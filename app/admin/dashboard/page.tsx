import Link from "next/link";
import { Package, MessageSquare, FolderOpen, Settings, Eye, ArrowRight, Star, TrendingUp } from "lucide-react";
import { products, categories } from "@/lib/data";

const stats = [
  { label: "Total Products", value: products.length, icon: Package, color: "bg-gold/10 text-gold border border-gold/20", href: "/admin/products", change: `${products.length} in catalog` },
  { label: "Categories", value: categories.length, icon: FolderOpen, color: "bg-gold/10 text-gold border border-gold/20", href: "/admin/categories", change: "All active" },
  { label: "Featured", value: products.filter((p) => p.isFeatured).length, icon: Star, color: "bg-gold/10 text-gold border border-gold/20", href: "/admin/products", change: "On homepage" },
  { label: "New Arrivals", value: products.filter((p) => p.isNew).length, icon: TrendingUp, color: "bg-green-500/10 text-green-400 border border-green-500/20", href: "/admin/products", change: "Recently added" },
];

const recentProducts = products.slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gold-gradient rounded-2xl p-6 text-brand-dark">
        <h2 className="font-display text-2xl font-bold mb-1">Welcome back, Admin! 👋</h2>
        <p className="text-brand-dark/70 text-sm">Here&apos;s a summary of your OCEAN Lighting Solutions store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="bg-brand-charcoal rounded-2xl border border-brand-border p-5 hover:border-gold/30 hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <ArrowRight size={16} className="text-brand-text/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-bold text-3xl text-white mb-0.5">{stat.value}</div>
            <div className="text-sm font-medium text-brand-text">{stat.label}</div>
            <div className="text-xs text-brand-text/50 mt-0.5">{stat.change}</div>
          </Link>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent products */}
        <div className="lg:col-span-2 bg-brand-charcoal rounded-2xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-lg">Recent Products</h3>
            <Link href="/admin/products" className="text-sm text-gold hover:text-gold/80 font-medium flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-brand-obsidian hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-bg shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">{product.name}</div>
                  <div className="text-xs text-brand-text capitalize">{product.category.replace(/-/g, " ")}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {product.isFeatured && (
                    <span className="text-xs bg-gold/10 text-gold font-medium px-2 py-0.5 rounded-full border border-gold/20">Featured</span>
                  )}
                  {product.isNew && (
                    <span className="text-xs bg-green-500/10 text-green-400 font-medium px-2 py-0.5 rounded-full border border-green-500/20">New</span>
                  )}
                  <Link href={`/products/${product.slug}`} target="_blank"
                    className="p-1.5 text-brand-text/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors" title="View on site">
                    <Eye size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6">
          <h3 className="font-semibold text-white text-lg mb-5">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { href: "/admin/products/new", label: "Add New Product", icon: Package, color: "bg-gold/10 text-gold border border-gold/20" },
              { href: "/admin/categories", label: "Manage Categories", icon: FolderOpen, color: "bg-gold/10 text-gold border border-gold/20" },
              { href: "/admin/inquiries", label: "View Inquiries", icon: MessageSquare, color: "bg-green-500/10 text-green-400 border border-green-500/20" },
              { href: "/admin/settings", label: "Site Settings", icon: Settings, color: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center shrink-0`}>
                  <action.icon size={18} />
                </div>
                <span className="text-sm font-medium text-brand-text group-hover:text-gold transition-colors flex-1">{action.label}</span>
                <ArrowRight size={15} className="text-brand-text/30 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>

          <div className="border-t border-brand-border mt-5 pt-5">
            <h4 className="text-xs font-semibold text-brand-text/50 uppercase tracking-wider mb-3">Live Pages</h4>
            {[
              { href: "/products", label: "View Products Page" },
              { href: "/gallery", label: "View Gallery" },
              { href: "/contact", label: "View Contact Page" },
            ].map((link) => (
              <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-sm text-brand-text/50 hover:text-gold transition-colors">
                <Eye size={14} /> {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
