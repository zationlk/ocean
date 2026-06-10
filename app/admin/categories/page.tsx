"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categories as initialCategories } from "@/lib/data";
import { Category } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      setCats((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCats((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, "-") } : c
        )
      );
      toast.success("Category updated");
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        icon: formData.icon || "📦",
        image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80",
      };
      setCats((prev) => [...prev, newCat]);
      toast.success("Category created");
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", icon: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-brand-text text-sm">{cats.length} categories</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", description: "", icon: "" }); }}
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-brand-primary p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Category name"
                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="e.g. 💡"
                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description"
                  className="w-full px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                {editingId ? "Update" : "Create"} Category
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="border border-brand-border text-brand-text hover:border-brand-primary font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-brand-border overflow-hidden hover:border-brand-primary hover:shadow-card transition-all duration-300">
            <div className="h-32 overflow-hidden relative">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand-dark/40" />
              <div className="absolute top-3 left-3 text-2xl">{cat.icon}</div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-brand-text mb-4">{cat.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setFormData({ name: cat.name, description: cat.description, icon: cat.icon });
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
