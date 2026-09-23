"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Category } from "@/lib/types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const inputCls = "w-full px-4 py-2.5 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

export default function AdminCategoriesPage() {
  const [cats, setCats]           = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState({
    name: "", description: "", icon: "", image: "", mainCategory: "lighting"
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCats(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load categories");
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => {
    setForm({ name: "", description: "", icon: "", image: "", mainCategory: "lighting" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description,
      icon: cat.icon || "",
      image: cat.image || "",
      mainCategory: cat.mainCategory ?? cat.main_category ?? "lighting",
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slug = form.name.toLowerCase().replace(/\s+/g, "-");
    const mainCat = form.mainCategory || "lighting";
    const defaultImg = "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80";

    try {
      if (editingId) {
        const currentCat = cats.find(c => c.id === editingId);
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: form.name,
            slug,
            main_category: mainCat,
            description: form.description,
            icon: form.icon || "📦",
            image: form.image || currentCat?.image || defaultImg,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.error || "Failed to update category");
          return;
        }
        if (json?.data) {
          setCats(p => p.map(c => c.id === editingId ? json.data : c));
        }
        toast.success("Category updated");
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug,
            main_category: mainCat,
            description: form.description,
            icon: form.icon || "📦",
            image: form.image || defaultImg,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.data) {
          toast.error(json.error || "Failed to create category");
          return;
        }
        setCats(p => [...p, json.data as Category]);
        toast.success("Category created");
      }
      closeForm();
    } catch {
      toast.error("Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to delete category");
        return;
      }
      setCats(p => p.filter(c => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Request failed");
    }
  };

  const lighting  = cats.filter(c => (c.mainCategory ?? c.main_category) === "lighting");
  const bathware  = cats.filter(c => (c.mainCategory ?? c.main_category) === "bathware");

  function CatGrid({ items, label }: { items: Category[]; label: string }) {
    return (
      <div>
        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-white/10 inline-block" /> {label} · {items.length}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(cat => (
            <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0d0d10] rounded-2xl border border-white/6 overflow-hidden hover:border-white/12 transition-all group"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
              <div className="h-28 overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10]/80 to-transparent" />
                <div className="absolute top-2 left-2 text-xl">{cat.icon}</div>
                <div className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white/60 border border-white/10">
                  {(cat.mainCategory ?? cat.main_category) === "lighting" ? "Lighting" : "Bathware"}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white/80 text-sm mb-1 group-hover:text-white transition-colors">{cat.name}</h4>
                <p className="text-[11px] text-white/30 mb-3 line-clamp-2 font-light">{cat.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)}
                    className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-gold hover:bg-gold/8 px-3 py-1.5 rounded-lg transition-all">
                    <Edit size={11} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-red-400 hover:bg-red-500/8 px-3 py-1.5 rounded-lg transition-all">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Categories</h2>
          <p className="text-white/30 text-sm mt-0.5">{cats.length} categories · {lighting.length} Lighting · {bathware.length} Bathware</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow">
          <Plus size={17} /> Add Category
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="bg-[#0d0d10] rounded-2xl border border-gold/25 overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(212,175,55,0.08)" }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="p-6">
              <h3 className="font-semibold text-white mb-5 text-sm">{editingId ? "Edit Category" : "New Category"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  <div>
                    <label className={labelCls}>Main Category <span className="text-red-400">*</span></label>
                    <select
                      value={form.mainCategory}
                      onChange={e => setForm(p => ({ ...p, mainCategory: e.target.value }))}
                      className={`${inputCls} cursor-pointer`}
                      required
                    >
                      <option value="lighting">Lighting & Electrical</option>
                      <option value="bathware">Bathware & Sanitaryware</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Category name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Icon (emoji)</label>
                    <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. 💡" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description" className={inputCls} />
                  </div>
                </div>
                <div className="mb-5">
                  <label className={labelCls}>Category Image URL</label>
                  <input type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://example.com/category-image.jpg" className={inputCls} />
                  <p className="text-white/20 text-[10px] mt-1">Enter image URL (Unsplash, Media Library, or any public image link)</p>
                  {form.image && form.image.startsWith("http") && (
                    <div className="mt-3 w-40 h-28 rounded-xl overflow-hidden border border-white/8 bg-brand-obsidian">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-60">
                    {submitting ? "Saving…" : (editingId ? "Update" : "Create")}
                  </button>
                  <button type="button" onClick={closeForm} className="border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CatGrid items={lighting} label="Lighting & Electrical" />
      <CatGrid items={bathware} label="Bathware & Plumbing" />
    </div>
  );
}
