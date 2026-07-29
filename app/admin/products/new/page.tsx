"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import toast from "react-hot-toast";

const inputClass = "w-full px-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-brand-text/30";
const labelClass = "block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", category: "", shortDescription: "", description: "",
    isFeatured: false, isNew: false, badge: "",
  });
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Product created successfully!");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products"
          className="p-2 text-brand-text hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Add New Product</h2>
          <p className="text-brand-text text-sm">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-5">
          <h3 className="font-semibold text-white">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name <span className="text-red-400">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Premium LED Panel Light 60W" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category <span className="text-red-400">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className={`${inputClass} cursor-pointer`}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Short Description <span className="text-red-400">*</span></label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required placeholder="Brief product description (shown in cards)" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Full Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Detailed product description..." className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Badge</label>
              <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. Best Seller" className={inputClass} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-gold" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-brand-text">Featured Product</label>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isNew" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 accent-gold" />
              <label htmlFor="isNew" className="text-sm font-medium text-brand-text">Mark as New</label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-white">Features</h3>
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text" value={feature}
                onChange={(e) => { const u = [...features]; u[i] = e.target.value; setFeatures(u); }}
                placeholder={`Feature ${i + 1}`} className={inputClass}
              />
              <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                className="p-2.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setFeatures([...features, ""])}
            className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium transition-colors">
            <Plus size={14} /> Add Feature
          </button>
        </div>

        {/* Specifications */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-white">Specifications</h3>
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={spec.key}
                onChange={(e) => { const u = [...specs]; u[i] = { ...u[i], key: e.target.value }; setSpecs(u); }}
                placeholder="Spec name (e.g. Power)" className={inputClass}
              />
              <input type="text" value={spec.value}
                onChange={(e) => { const u = [...specs]; u[i] = { ...u[i], value: e.target.value }; setSpecs(u); }}
                placeholder="Value (e.g. 60W)" className={inputClass}
              />
              <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                className="p-2.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium transition-colors">
            <Plus size={14} /> Add Specification
          </button>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-brand-dark font-bold px-6 py-3 rounded-xl transition-colors hover:shadow-gold-glow">
            {isSubmitting ? <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" /> : <Save size={18} />}
            Save Product
          </button>
          <Link href="/admin/products"
            className="flex items-center gap-2 border border-brand-border text-brand-text hover:border-gold/40 hover:text-gold font-semibold px-6 py-3 rounded-xl transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
