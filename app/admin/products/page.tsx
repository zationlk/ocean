"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Star, Package, X, Filter } from "lucide-react";
import { products as staticProducts, categories } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Product {
  id: string; name: string; slug: string; category: string;
  shortDescription?: string; short_description?: string; description?: string;
  images: string[]; isFeatured?: boolean; isNew?: boolean;
  is_featured?: boolean; is_new?: boolean; badge?: string;
}

function normalise(p: Product): Product {
  return {
    ...p,
    isFeatured: p.isFeatured ?? p.is_featured ?? false,
    isNew: p.isNew ?? p.is_new ?? false,
    shortDescription: p.shortDescription ?? p.short_description ?? p.description ?? "",
  };
}

export default function AdminProductsPage() {
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("all");
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
      setProducts((!error && data?.length ? data : (staticProducts as unknown as Product[])).map(normalise));
    } catch {
      setProducts((staticProducts as unknown as Product[]).map(normalise));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      const sb = createSupabaseBrowserClient();
      const { error } = await sb.from("products").delete().eq("id", id);
      if (error) { toast.error("Failed to delete"); return; }
      setProducts(p => p.filter(x => x.id !== id));
      toast.success("Product deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeletingId(null); }
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Products</h2>
          <p className="text-white/30 text-sm mt-0.5">{products.length} products in catalogue</p>
        </div>
        <Link href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow shrink-0">
          <Plus size={17} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 transition-all placeholder:text-white/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-white/25 shrink-0" />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="bg-brand-obsidian text-white/70 border border-white/8 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div className="text-sm text-white/30 flex items-center shrink-0">
          <span className="text-white font-semibold">{filtered.length}</span>&nbsp;results
        </div>
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
          <p className="text-white/40 font-medium">No products found</p>
          {search && <button onClick={() => { setSearch(""); setCatFilter("all"); }} className="mt-2 text-gold text-sm hover:underline">Clear filters</button>}
        </div>
      ) : (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Product</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Category</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Status</th>
                  <th className="text-right px-5 py-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-brand-bg shrink-0 border border-white/5">
                          <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white/80 text-sm truncate max-w-[200px] group-hover:text-white transition-colors">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-white/30 truncate max-w-[200px]">{product.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-white/40 capitalize">{product.category?.replace(/-/g, " ")}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-gold/10 text-gold font-semibold px-2 py-0.5 rounded-full border border-gold/20">
                            <Star size={9} /> Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="text-[10px] bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded-full border border-green-500/20">New</span>
                        )}
                        {product.badge && (
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/20">{product.badge}</span>
                        )}
                        {!product.isFeatured && !product.isNew && !product.badge && (
                          <span className="text-[11px] text-white/20">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/products/${product.slug}`} target="_blank"
                          className="p-2 text-white/20 hover:text-gold hover:bg-gold/8 rounded-lg transition-colors" title="View">
                          <Eye size={15} />
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-white/20 hover:text-blue-400 hover:bg-blue-500/8 rounded-lg transition-colors" title="Edit">
                          <Edit size={15} />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.name)} disabled={deletingId === product.id}
                          className={cn("p-2 text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-colors", deletingId === product.id && "opacity-50 cursor-not-allowed")}
                          title="Delete">
                          {deletingId === product.id
                            ? <div className="w-3.5 h-3.5 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                            : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
