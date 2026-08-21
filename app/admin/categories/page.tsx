"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categories as initialCategories } from "@/lib/data";
import { Category } from "@/lib/types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const inputCls = "w-full px-4 py-2.5 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

const LIGHTING_SLUGS = new Set(["indoor-lighting","outdoor-lighting","commercial-lighting","led-bulbs","led-tube-lights","led-ceiling-lights","led-strip-lighting","led-mirror-lights","led-step-lights","electrical-items"]);

export default function AdminCategoriesPage() {
  const [cats, setCats]           = useState<Category[]>(initialCategories);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState({ name: "", description: "", icon: "" });

  const openAdd = () => { setForm({ name: "", description: "", icon: "" }); setEditingId(null); setShowForm(true); };
  const openEdit = (cat: Category) => { setForm({ name: cat.name, description: cat.description, icon: cat.icon }); setEditingId(cat.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCats(p => p.map(c => c.id === editingId ? { ...c, ...form, slug: form.name.toLowerCase().replace(/\s+/g, "-") } : c));
      toast.success("Category updated");
    } else {
      const nc: Category = { id: `cat-${Date.now()}`, name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, "-"), description: form.description, icon: form.icon || "📦", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80" };
      setCats(p => [...p, nc]);
      toast.success("Category created");
    }
    closeForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      setCats(p => p.filter(c => c.id !== id));
      toast.success("Category deleted");
    }
  };

  const lighting  = cats.filter(c => LIGHTING_SLUGS.has(c.slug));
  const bathware  = cats.filter(c => !LIGHTING_SLUGS.has(c.slug));

  function CatGrid({ items, label }: { items: Category[]; label: string }) {
    return (
      <div>
        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-white/10 inline-block" /> {label}
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

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Inline form */}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
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
                <div className="flex gap-3">
                  <button type="submit" className="bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
                    {editingId ? "Update" : "Create"}
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

      {/* Groups */}
      <CatGrid items={lighting} label="Lighting & Electrical" />
      <CatGrid items={bathware} label="Bathware & Plumbing" />
    </div>
  );
}
