"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, FolderOpen, MessageSquare,
  Settings, LogOut, Menu, X, Sparkles, Image, ChevronRight, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const SidebarContent = ({ pathname, onLinkClick, onLogout }: {
  pathname: string; onLinkClick?: () => void; onLogout: () => void;
}) => (
  <>
    <div className="p-5 border-b border-white/5 shrink-0">
      <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onLinkClick}>
        <div className="w-10 h-10 bg-gold/20 border border-gold/30 rounded-lg flex items-center justify-center">
          <Sparkles size={20} className="text-gold" />
        </div>
        <div>
          <div className="font-display font-bold text-base tracking-widest text-white">OCEAN</div>
          <div className="text-gold/60 text-[10px] tracking-widest uppercase">Admin Panel</div>
        </div>
      </Link>
    </div>

    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href} onClick={onLinkClick}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive ? "bg-gold/15 text-gold border border-gold/20" : "text-white/50 hover:text-white hover:bg-white/5"
            )}>
            <item.icon size={18} />
            {item.label}
            {isActive && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        );
      })}
    </nav>

    <div className="p-4 border-t border-white/5 space-y-1 shrink-0">
      <Link href="/" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
        <ExternalLink size={18} /> View Website
      </Link>
      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors">
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  </>
);

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login" || pathname === "/admin") return <>{children}</>;

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const currentLabel = navItems.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + "/")
  )?.label || "Admin Panel";

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 z-30 w-64 h-screen bg-brand-obsidian border-r border-white/5 text-white">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed top-0 left-0 z-50 flex flex-col w-72 h-screen bg-brand-obsidian border-r border-white/5 text-white transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <SidebarContent pathname={pathname} onLinkClick={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar — dark */}
        <header className="bg-brand-charcoal border-b border-brand-border px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors" aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-white truncate">{currentLabel}</h1>
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-brand-text hover:text-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-gold/10">
              <ExternalLink size={12} /> View Site
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold/90 rounded-full flex items-center justify-center text-brand-dark text-sm font-bold">A</div>
              <span className="text-sm font-medium text-brand-text hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-brand-bg">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-brand-border bg-brand-charcoal">
          <p className="text-xs text-brand-text/40 text-center">OCEAN Lighting Solutions — Admin Panel</p>
        </footer>
      </div>
    </div>
  );
}
