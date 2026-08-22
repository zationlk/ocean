"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Star, Package, X, Filter, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";
import { products as staticProducts, categories } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { deleteProduct, toggleFeatured, toggleNew } from "@/lib/admin-actions";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string; name: string; slug: string; category: string;
  shortDescription?: string; short_description?: string; description?: string;
  images: string[]; isFeatured?: boolean; isNew?: boolean;
  is_featured?: boolean; is_new?: boolean; badge?: string;
}

function normalise(p: Product): Product {
  return {
    ...p,
    isFeatured: !!(p.isFeatured ?? p.is_featured),
    isNew:      !!(p.isNew      ?? p.is_new),
    shortDescription: p.shortDescription ?? p.short_description ?? p.description ?? "",
  };
}

// Confirmation modal
function ConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-[#0d0d10] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <h3 className="font-semibold text-white text-center mb-2">Delete Product?</h3>
        <p className="text-white/40 text-sm text-center mb-6 leading-relaxed">
          &ldquo;<span className="text-white/70">{name}</span>&rdquo; will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 border border-white/8 text-white/50 hover:text-white hover:border-white/20 font-semibold py-2.5 rounded-xl text-sm transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminProductsPage() {
  const [products,     setProducts]     = useState<Product[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [confirmItem,  setConfirmItem]  = useState<Product | null>(null);
  const [togglingId,   setTogglingId]   = useState<string | null>(null);
  const [supabaseOk,   setSupabaseOk]   = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
      if (!error && data?.length) {
        setProducts(data.map(normalise));
        setSupabaseOk(true);
      } else {
        setProducts((staticProducts as unknown as Product[]).map(normalise));
        setSupabaseOk(false);
      }
    } catch {
      setProducts((staticProducts as unknown as Product[]).map(normalise));
      setSupabaseOk(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Delete ──
  const handleDeleteConfirm = async () => {
    if (!confirmItem) return;
    const { id, name } = confirmItem;
    setConfirmItem(null);
    setDeletingId(id);

    const { error } = await deleteProduct(id);
    if (error) {
      if (!supabaseOk) {
        // Static data mode — remove from local state
        setProducts(p => p.filter(x => x.id !== id));
        toast.success("Product removed");
      } else {
        toast.error("Failed to delete: " + error);
      }
    } else {
      setProducts(p => p.filter(x => x.id !== id));
      toast.success(`"${name}" deleted`);
    }
    setDeletingId(null);
  };

  // ── Toggle Featured ──
  const handleToggleFeatured = async (product: Product) => {
    setTogglingId(product.id);
    const newVal = !product.isFeatured;

    // Optimistic
    setProducts(p => p.map(x => x.id === product.id ? { ...x, isFeatured: newVal } : x));

    const { error } = await toggleFeatured(product.id, !!product.isFeatured);
    if (error && supabaseOk) {
      toast.error("Failed to update");
      setProducts(p => p.map(x => x.id === product.id ? { ...x, isFeatured: !newVal } : x)); // revert
    } else {
      toast.success(newVal ? "Marked as Featured" : "Removed from Featured");
    }
    setTogglingId(null);
  };

  // ── Toggle New ──
  const handleToggleNew = async (product: Product) => {
    setTogglingId(product.id);
    const newVal = !product.isNew;
    setProducts(p => p.map(x => x.id === product.id ? { ...x, isNew: newVal } : x));

    const { error } = await toggleNew(product.id, !!product.isNew);
    if (error && supabaseOk) {
      toast.error("Failed to update");
      setProducts(p => p.map(x => x.id === product.id ? { ...x, isNew: !newVal } : x));
    } else {
      toast.success(newVal ? "Marked as New Arrival" : "Removed from New Arrivals");
    }
    setTogglingId(null);
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (
      (!q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)) &&
      (catFilter === "all" || p.category === catFilter)
    );
  });

  return (
    <>
      <AnimatePresence>
        {confirmItem && (
          <ConfirmModal
            name={confirmItem.name}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmItem(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Products</h2>
            <p className="text-white/30 text-sm mt-0.5">
              {products.length} products
              {!supabaseOk && (
                <span className="ml-2 text-amber-400/70 text-xs">· static data mode</span>
              )}
            </p>
          </div>
          <Link href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow shrink-0">
            <Plus size={17} /> Add Product
          </Link>
        </div>

        {!supabaseOk && (
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertCircle size={14} className="text-amber-400 shrink-0" />
            <p className="text-amber-400/70 text-xs">Running on static data — changes won&apos;t persist. Connect Supabase to enable full CRUD.</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#0a0a0c] text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 transition-all placeholder:text-white/20" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-white/25 shrink-0" />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="bg-[#0a0a0c] text-white/60 border border-white/8 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-all cursor-pointer">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          <p className="text-white/25 text-sm ml-auto shrink-0">
            <span className="text-white font-semibold">{filtered.length}</span> results
          </p>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/30 mt-3 text-sm">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
            <Package size={36} className="mx-auto mb-3 text-white/10" />
            <p className="text-white/40">No products found</p>
            {(search || catFilter !== "all") && (
              <button onClick={() => { setSearch(""); setCatFilter("all"); }}
                className="mt-2 text-gold text-sm hover:underline">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Product</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Category</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Featured</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">New</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Badge</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {filtered.map(product => (
                    <tr key={product.id}
                      className={cn("transition-colors group", deletingId === product.id ? "opacity-40 pointer-events-none" : "hover:bg-white/2")}>
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#0a0a0c] shrink-0 border border-white/5">
                            <img src={product.images?.[0] || ""} alt={product.name}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=80&q=60"; }} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-white/80 truncate max-w-[180px] group-hover:text-white transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-white/25 truncate max-w-[180px]">{product.shortDescription}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-white/40 capitalize">{product.category?.replace(/-/g, " ")}</span>
                      </td>

                      {/* Featured toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          disabled={togglingId === product.id}
                          title={product.isFeatured ? "Remove from featured" : "Mark as featured"}
                          className="transition-all disabled:opacity-40"
                        >
                          {product.isFeatured
                            ? <ToggleRight size={22} className="text-gold" />
                            : <ToggleLeft size={22} className="text-white/20 hover:text-white/50" />}
                        </button>
                      </td>

                      {/* New toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleNew(product)}
                          disabled={togglingId === product.id}
                          title={product.isNew ? "Remove from new arrivals" : "Mark as new"}
                          className="transition-all disabled:opacity-40"
                        >
                          {product.isNew
                            ? <ToggleRight size={22} className="text-green-400" />
                            : <ToggleLeft size={22} className="text-white/20 hover:text-white/50" />}
                        </button>
                      </td>

                      {/* Badge */}
                      <td className="px-4 py-3.5">
                        {product.badge
                          ? <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/20">{product.badge}</span>
                          : <span className="text-white/20 text-xs">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/products/${product.slug}`} target="_blank"
                            className="p-2 text-white/20 hover:text-gold hover:bg-gold/8 rounded-lg transition-colors" title="View on site">
                            <Eye size={15} />
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-white/20 hover:text-blue-400 hover:bg-blue-500/8 rounded-lg transition-colors" title="Edit">
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setConfirmItem(product)}
                            disabled={deletingId === product.id}
                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-colors disabled:opacity-30"
                            title="Delete"
                          >
                            {deletingId === product.id
                              ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                              : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-[11px] text-white/20">
                Showing {filtered.length} of {products.length} products
              </p>
              <div className="flex items-center gap-3 text-[11px] text-white/20">
                <span className="flex items-center gap-1"><Star size={11} className="text-gold" /> {products.filter(p => p.isFeatured).length} featured</span>
                <span className="flex items-center gap-1 text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> {products.filter(p => p.isNew).length} new</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
