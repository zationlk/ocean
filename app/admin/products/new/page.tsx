"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    isFeatured: false,
    isNew: false,
    badge: "",
  });
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Product created successfully!");
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-brand-text text-sm">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Premium LED Panel Light 60W"
                className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              placeholder="Brief product description (shown in cards)"
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed product description..."
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Best Seller, New"
                className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-brand-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-4 h-4 accent-brand-primary"
              />
              <label htmlFor="isNew" className="text-sm font-medium text-gray-700">
                Mark as New
              </label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Features</h3>
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const updated = [...features];
                  updated[i] = e.target.value;
                  setFeatures(updated);
                }}
                placeholder={`Feature ${i + 1}`}
                className="flex-1 px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures([...features, ""])}
            className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
          >
            <Plus size={14} />
            Add Feature
          </button>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Specifications</h3>
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => {
                  const updated = [...specs];
                  updated[i] = { ...updated[i], key: e.target.value };
                  setSpecs(updated);
                }}
                placeholder="Spec name (e.g. Power)"
                className="flex-1 px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const updated = [...specs];
                  updated[i] = { ...updated[i], value: e.target.value };
                  setSpecs(updated);
                }}
                placeholder="Value (e.g. 60W)"
                className="flex-1 px-4 py-2.5 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
          >
            <Plus size={14} />
            Add Specification
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Product
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 border border-brand-border text-brand-text hover:border-brand-primary hover:text-brand-primary font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
