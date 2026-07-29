"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Star, Package, X } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  shortDescription?: string;
  short_description?: string;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  badge?: string;
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
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data.map(normalise));
      } else {
        // Supabase not configured or empty — fall back to static data
        setProducts((staticProducts as unknown as Product[]).map(normalise));
      }
    } catch {
      setProducts((staticProducts as unknown as Product[]).map(normalise));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete product");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-3 text-sm">Loading products…</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">No products found</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 text-sm text-gold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <img
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[200px]">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-[200px]">
                              {product.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600 capitalize">
                          {product.category?.replace(/-/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                              <Star size={10} />
                              Featured
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-xs bg-gold-50 text-gold-700 font-medium px-2 py-0.5 rounded-full border border-gold-200">
                              New
                            </span>
                          )}
                          {product.badge && (
                            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full border border-blue-200">
                              {product.badge}
                            </span>
                          )}
                          {!product.isFeatured && !product.isNew && !product.badge && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gold hover:bg-gold-50 rounded-lg transition-colors"
                            title="View on site"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className={cn(
                              "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                              deletingId === product.id && "opacity-50 cursor-not-allowed"
                            )}
                            title="Delete"
                          >
                            {deletingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
