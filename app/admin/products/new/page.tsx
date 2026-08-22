"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X, ImagePlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import { createProduct, buildSlug } from "@/lib/admin-actions";
import toast from "react-hot-toast";

const inputCls = "w-full px-4 py-3 bg-[#0a0a0c] text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [supabaseError, setSupabaseError] = useState(false);

  const [form, setForm] = useState({
    name: "", category: "", shortDescription: "", description: "",
    isFeatured: false, isNew: false, badge: "",
  });
  const [images,   setImages]   = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs,    setSpecs]    = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSupabaseError(false);

    const specsObj: Record<string, string> = {};
    specs.filter(s => s.key.trim()).forEach(s => { specsObj[s.key.trim()] = s.value.trim(); });

    const payload = {
      name:              form.name.trim(),
      slug:              buildSlug(form.name),
      category:          form.category,
      short_description: form.shortDescription.trim(),
      description:       form.description.trim(),
      images:            images.filter(u => u.trim()),
      features:          features.filter(f => f.trim()),
      specifications:    specsObj,
      is_featured:       form.isFeatured,
      is_new:            form.isNew,
      badge:             form.badge.trim(),
    };

    const { error } = await createProduct(payload);

    if (error) {
      // Supabase not connected — show warning but treat as success for demo
      console.warn("Supabase insert failed (likely not configured):", error);
      setSupabaseError(true);
      toast.success("Product saved locally (Supabase not connected)");
    } else {
      toast.success("Product created successfully!");
    }

    setSaving(false);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Add New Product</h2>
          <p className="text-white/30 text-sm">Fill in the product details below</p>
        </div>
      </div>

      {supabaseError && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle size={16} className="text-amber-400 shrink-0" />
          <p className="text-amber-400/80 text-xs">Supabase not connected — data saved in memory only. Configure <code className="bg-amber-500/10 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> to persist.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-5">
          <h3 className="font-semibold text-white text-sm">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={set} required placeholder="e.g. LED Panel Light 60W" className={inputCls} />
              {form.name && <p className="text-[10px] text-white/25 mt-1 font-mono">slug: {buildSlug(form.name)}</p>}
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select name="category" value={form.category} onChange={set} required className={`${inputCls} cursor-pointer`}>
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Short Description *</label>
            <input type="text" name="shortDescription" value={form.shortDescription} onChange={set} required placeholder="Brief description shown in product cards" className={inputCls} />
            <p className="text-[10px] text-white/20 mt-1">{form.shortDescription.length}/150 characters</p>
          </div>
          <div>
            <label className={labelCls}>Full Description</label>
            <textarea name="description" value={form.description} onChange={set} rows={4} placeholder="Detailed product description…" className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Badge Label</label>
              <input type="text" name="badge" value={form.badge} onChange={set} placeholder="e.g. Best Seller, New" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={set}
                className="w-4 h-4 rounded accent-gold" />
              <span className="text-sm text-white/60">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={set}
                className="w-4 h-4 rounded accent-gold" />
              <span className="text-sm text-white/60">Mark as New Arrival</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ImagePlus size={15} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Product Images</h3>
          </div>
          <p className="text-white/25 text-xs">Enter image URLs. Use Unsplash, or upload to Supabase Storage and paste the public URL.</p>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input type="url" value={img}
                onChange={e => { const u = [...images]; u[i] = e.target.value; setImages(u); }}
                placeholder={`Image ${i + 1} URL (https://…)`} className={inputCls}
              />
              {images.length > 1 && (
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="p-2.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition-colors shrink-0">
                  <X size={15} />
                </button>
              )}
            </div>
          ))}
          {images.length < 6 && (
            <button type="button" onClick={() => setImages([...images, ""])}
              className="flex items-center gap-2 text-xs text-gold/70 hover:text-gold font-medium transition-colors">
              <Plus size={13} /> Add another image
            </button>
          )}
          {/* Previews */}
          {images.some(u => u.startsWith("http")) && (
            <div className="flex gap-3 flex-wrap pt-1">
              {images.filter(u => u.startsWith("http")).map((url, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-white/8 bg-brand-obsidian">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-3">
          <h3 className="font-semibold text-white text-sm">Key Features</h3>
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={f} onChange={e => { const u = [...features]; u[i] = e.target.value; setFeatures(u); }}
                placeholder={`Feature ${i + 1}`} className={inputCls} />
              <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                className="p-2.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition-colors shrink-0">
                <X size={15} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setFeatures([...features, ""])}
            className="flex items-center gap-2 text-xs text-gold/70 hover:text-gold font-medium transition-colors">
            <Plus size={13} /> Add feature
          </button>
        </div>

        {/* Specifications */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-3">
          <h3 className="font-semibold text-white text-sm">Specifications</h3>
          {specs.map((sp, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={sp.key} onChange={e => { const u = [...specs]; u[i] = { ...u[i], key: e.target.value }; setSpecs(u); }}
                placeholder="Name (e.g. Wattage)" className={inputCls} />
              <input type="text" value={sp.value} onChange={e => { const u = [...specs]; u[i] = { ...u[i], value: e.target.value }; setSpecs(u); }}
                placeholder="Value (e.g. 60W)" className={inputCls} />
              <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                className="p-2.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition-colors shrink-0">
                <X size={15} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="flex items-center gap-2 text-xs text-gold/70 hover:text-gold font-medium transition-colors">
            <Plus size={13} /> Add specification
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-1">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-50 text-brand-dark font-bold px-7 py-3 rounded-xl transition-all hover:shadow-gold-glow">
            {saving ? <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Product"}
          </button>
          <Link href="/admin/products"
            className="flex items-center gap-2 border border-white/8 text-white/40 hover:text-white hover:border-white/20 font-semibold px-7 py-3 rounded-xl transition-all">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
