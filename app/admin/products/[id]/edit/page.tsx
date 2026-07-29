"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { products as staticProducts, categories } from "@/lib/data";
import toast from "react-hot-toast";

const inputClass =
  "w-full px-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-brand-text/30";
const labelClass =
  "block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2";

interface ProductForm {
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  isNew: boolean;
  badge: string;
  images: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    isFeatured: false,
    isNew: false,
    badge: "",
    images: [""],
  });
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  useEffect(() => {
    if (!id) return;
    // Try to find in static data (fallback when Supabase not configured)
    const product = staticProducts.find((p) => p.id === id || p.slug === id);
    if (!product) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setFormData({
      name: product.name,
      category: product.category,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      badge: product.badge || "",
      images: product.images.length > 0 ? product.images : [""],
    });
    setFeatures(product.features?.length ? product.features : [""]);
    setSpecs(
      product.specifications && Object.keys(product.specifications).length
        ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }]
    );
    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate save — in production this would write to Supabase
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Product updated successfully!");
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-24">
        <p className="text-white font-semibold text-lg mb-2">Product not found</p>
        <p className="text-brand-text text-sm mb-6">
          ID <code className="text-gold bg-brand-obsidian px-2 py-0.5 rounded">{id}</code> doesn&apos;t match any product.
        </p>
        <Link href="/admin/products" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-6 py-3 rounded-xl transition-colors">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-brand-text hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Edit Product</h2>
          <p className="text-brand-text text-sm truncate max-w-xs">{formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-5">
          <h3 className="font-semibold text-white">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name <span className="text-red-400">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
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
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required placeholder="Brief product description" className={inputClass} />
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
              <label htmlFor="isFeatured" className="text-sm font-medium text-brand-text cursor-pointer">Featured Product</label>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isNew" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 accent-gold" />
              <label htmlFor="isNew" className="text-sm font-medium text-brand-text cursor-pointer">Mark as New</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-white">Product Images</h3>
          <p className="text-brand-text/60 text-xs">Enter full image URLs (Unsplash, Supabase Storage, etc.)</p>
          {formData.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => {
                  const u = [...formData.images];
                  u[i] = e.target.value;
                  setFormData((p) => ({ ...p, images: u }));
                }}
                placeholder="https://..."
                className={inputClass}
              />
              {i < formData.images.length - 1 || formData.images.length > 1 ? (
                <button type="button"
                  onClick={() => setFormData((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                  className="p-2.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                  <X size={16} />
                </button>
              ) : null}
            </div>
          ))}
          {formData.images.length < 5 && (
            <button type="button"
              onClick={() => setFormData((p) => ({ ...p, images: [...p.images, ""] }))}
              className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium transition-colors">
              <Plus size={14} /> Add Image URL
            </button>
          )}
          {/* Image previews */}
          {formData.images.filter((u) => u.startsWith("http")).length > 0 && (
            <div className="flex gap-3 flex-wrap pt-2">
              {formData.images.filter((u) => u.startsWith("http")).map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-brand-border bg-brand-obsidian">
                  <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-white">Features</h3>
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={feature}
                onChange={(e) => { const u = [...features]; u[i] = e.target.value; setFeatures(u); }}
                placeholder={`Feature ${i + 1}`} className={inputClass} />
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
                placeholder="Spec name (e.g. Power)" className={inputClass} />
              <input type="text" value={spec.value}
                onChange={(e) => { const u = [...specs]; u[i] = { ...u[i], value: e.target.value }; setSpecs(u); }}
                placeholder="Value (e.g. 60W)" className={inputClass} />
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
            {isSubmitting
              ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
              : <><Save size={16} /> Save Changes</>
            }
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
