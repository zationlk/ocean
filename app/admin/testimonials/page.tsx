"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Star, Quote, X, Check } from "lucide-react";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/admin-actions";
import { Testimonial } from "@/lib/types";
import toast from "react-hot-toast";

const inputCls = "w-full px-4 py-3 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load testimonials");
      }
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", role: "", company: "", content: "", rating: 5, avatar: "" });
    setModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      role: item.role || "",
      company: item.company || "",
      content: item.content || "",
      rating: item.rating || 5,
      avatar: item.avatar || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    const { error } = await deleteTestimonial(id);
    if (error) {
      toast.error("Failed to delete testimonial: " + error);
      fetchTestimonials();
    } else {
      toast.success("Testimonial deleted");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error("Name and content are required");
      return;
    }

    setSubmitting(true);
    if (editingItem) {
      const { data, error } = await updateTestimonial(editingItem.id, formData);
      if (error) {
        toast.error("Failed to update: " + error);
      } else {
        toast.success("Testimonial updated");
        setModalOpen(false);
        fetchTestimonials();
      }
    } else {
      const { data, error } = await createTestimonial(formData);
      if (error) {
        toast.error("Failed to create: " + error);
      } else {
        toast.success("Testimonial added");
        setModalOpen(false);
        fetchTestimonials();
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Testimonials</h2>
          <p className="text-white/30 text-sm mt-0.5">Manage customer reviews and client quotes</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow"
        >
          <Plus size={17} /> Add Testimonial
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/30 mt-3 text-sm">Loading testimonials…</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-16 text-center">
          <Quote size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No testimonials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-4 relative group hover:border-gold/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm overflow-hidden shrink-0">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{t.name}</h3>
                    <p className="text-xs text-white/40">
                      {t.role} {t.company ? `at ${t.company}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 bg-white/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < (t.rating || 5) ? "fill-gold text-gold" : "text-white/10"}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/70 text-sm font-light leading-relaxed italic">
                &ldquo;{t.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d10] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <h3 className="font-display font-bold text-white text-lg">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
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
                <label className={labelCls}>Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Dilshan Fernando"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Role / Designation</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Architect"
                  />
                </div>
                <div>
                  <label className={labelCls}>Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Studio Forma"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Rating (1 - 5 Stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className={inputCls}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r} className="bg-brand-dark text-white">
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Testimonial Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`${inputCls} resize-none`}
                  placeholder="Enter client review or feedback..."
                />
              </div>

              <div>
                <label className={labelCls}>Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className={inputCls}
                  placeholder="/images/avatars/user1.jpg or https://..."
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
