"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Award, X, Check, Globe } from "lucide-react";
import { createBrand, updateBrand, deleteBrand } from "@/lib/admin-actions";
import { Brand } from "@/lib/types";
import toast from "react-hot-toast";

const inputCls = "w-full px-4 py-3 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Brand | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    sort_order: 0,
  });

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brands");
      if (res.ok) {
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load partner brands");
      }
    } catch {
      toast.error("Failed to load partner brands");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", logo: "", website: "", sort_order: brands.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (item: Brand) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      logo: item.logo || "",
      website: item.website || "",
      sort_order: item.sortOrder || item.sort_order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner brand?")) return;
    setBrands((prev) => prev.filter((b) => b.id !== id));
    const { error } = await deleteBrand(id);
    if (error) {
      toast.error("Failed to delete brand: " + error);
      fetchBrands();
    } else {
      toast.success("Partner brand deleted");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Brand name is required");
      return;
    }

    setSubmitting(true);
    if (editingItem) {
      const { data, error } = await updateBrand(editingItem.id, formData);
      if (error) {
        toast.error("Failed to update: " + error);
      } else {
        toast.success("Partner brand updated");
        setModalOpen(false);
        fetchBrands();
      }
    } else {
      const { data, error } = await createBrand(formData);
      if (error) {
        toast.error("Failed to create: " + error);
      } else {
        toast.success("Partner brand added");
        setModalOpen(false);
        fetchBrands();
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Partners & Brands</h2>
          <p className="text-white/30 text-sm mt-0.5">Manage featured partner brand logos and links</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow"
        >
          <Plus size={17} /> Add Partner Brand
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/30 mt-3 text-sm">Loading partner brands…</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
          <Award size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No partner brands added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-[#0d0d10] rounded-2xl border border-white/6 p-5 flex items-center justify-between gap-4 group hover:border-gold/30 transition-all"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 text-gold font-bold text-sm shrink-0 overflow-hidden">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                  ) : (
                    <Award size={20} className="text-gold/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{b.name}</h3>
                  {b.website && (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold/70 hover:text-gold flex items-center gap-1 transition-colors truncate"
                    >
                      <Globe size={11} /> {b.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d10] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <h3 className="font-display font-bold text-white text-lg">
                {editingItem ? "Edit Partner Brand" : "Add Partner Brand"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Brand / Partner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Philips LED"
                />
              </div>

              <div>
                <label className={labelCls}>Logo Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className={inputCls}
                  placeholder="/images/brands/philips.svg or https://..."
                />
              </div>

              <div>
                <label className={labelCls}>Website URL (Optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={inputCls}
                  placeholder="https://www.philips.com"
                />
              </div>

              <div>
                <label className={labelCls}>Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-brand-dark font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
