"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Package, FolderOpen, MessageSquare,
  Settings, LogOut, Menu, X, Image as ImageIcon,
  ChevronRight, ExternalLink, Bell, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: LayoutDashboard, badge: null },
  { href: "/admin/products",   label: "Products",   icon: Package,         badge: null },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen,      badge: null },
  { href: "/admin/inquiries",  label: "Inquiries",  icon: MessageSquare,   badge: "3" },
  { href: "/admin/media",      label: "Media",      icon: ImageIcon,       badge: null },
  { href: "/admin/settings",   label: "Settings",   icon: Settings,        badge: null },
];

function SidebarContent({ pathname, onLinkClick, onLogout }: {
  pathname: string;
  onLinkClick?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group" onClick={onLinkClick}>
          <div className="relative w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide leading-none">Ocean Lighting</div>
            <div className="text-[10px] text-gold/50 tracking-widest uppercase leading-none mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gold/12 text-gold"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-xl bg-gold/10 border border-gold/15"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon size={17} className="relative z-10 shrink-0" />
              <span className="relative z-10 flex-1">{item.label}</span>
              {item.badge && (
                <span className="relative z-10 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={13} className="relative z-10 ml-auto text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5 shrink-0">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={17} />
          <span>View Website</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login" || pathname === "/admin") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const currentPage = navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"));
  const currentLabel = currentPage?.label || "Admin Panel";

  return (
    <div className="flex min-h-screen bg-[#0a0a0c]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 z-30 w-64 h-screen bg-[#0d0d10] border-r border-white/5">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 z-50 w-72 h-screen bg-[#0d0d10] border-r border-white/5 flex flex-col"
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <SidebarContent pathname={pathname} onLinkClick={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-14 px-4 lg:px-6 bg-[#0d0d10]/95 backdrop-blur-md border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2">
            {currentPage && <currentPage.icon size={16} className="text-gold/60" />}
            <h1 className="font-semibold text-white text-sm">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Search shortcut */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/8 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors">
              <Search size={13} />
              <span>Search</span>
              <kbd className="text-[9px] border border-white/10 rounded px-1 py-0.5">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* View site */}
            <Link href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/40 hover:text-gold hover:bg-gold/8 transition-all border border-white/5">
              <ExternalLink size={12} /> View Site
            </Link>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-brand-dark text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 bg-[#0a0a0c]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="px-6 py-3 border-t border-white/5 bg-[#0d0d10]">
          <p className="text-[11px] text-white/20 text-center">
            Ocean Lighting Solutions · Admin Panel · v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}
