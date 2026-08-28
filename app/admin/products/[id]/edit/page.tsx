"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X, Loader2, ImagePlus, AlertCircle, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { updateProduct, buildSlug } from "@/lib/admin-actions";
import toast from "react-hot-toast";

const inputCls = "w-full px-4 py-3 bg-[#0a0a0c] text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";

interface ProductForm {
  name: string; mainCategory: string; category: string; subcategory: string; modelNumber: string;
  shortDescription: string; description: string;
  isFeatured: boolean; isNew: boolean; badge: string; images: string[];
}

interface ApiProduct {
  id: string; name: string; slug: string; category: string; subcategory?: string;
  modelNumber?: string; model_number?: string;
  shortDescription?: string; short_description?: string; description?: string;
  images: string[]; isFeatured?: boolean; isNew?: boolean;
  is_featured?: boolean; is_new?: boolean; badge?: string;
  features?: string[]; specifications?: Record<string, string>;
}

function normaliseProduct(p: ApiProduct): ApiProduct {
  return {
    ...p,
    modelNumber: p.modelNumber ?? p.model_number ?? "",
    isFeatured: !!(p.isFeatured ?? p.is_featured),
    isNew:      !!(p.isNew ?? p.is_new),
    shortDescription: p.shortDescription ?? p.short_description ?? p.description ?? "",
  };
}

export default function EditProductPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;

  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [notFound,      setNotFound]      = useState(false);
  const [categories,    setCategories]    = useState<Category[]>([]);
  const [originalSlug, setOriginalSlug]  = useState("");
  const [productId, setProductId]     = useState<string>("");

  const [form, setForm] = useState<ProductForm>({
    name: "", mainCategory: "", category: "", subcategory: "", modelNumber: "", shortDescription: "", description: "",
    isFeatured: false, isNew: false, badge: "", images: [""],
  });
  const [features, setFeatures] = useState<string[]>([""]);
  const [specs,    setSpecs]    = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/products?slug=${encodeURIComponent(id)}`),
        fetch("/api/categories"),
      ]);

      if (categoriesRes.ok) {
        const cdata = await categoriesRes.json();
        setCategories(Array.isArray(cdata) ? cdata : []);
      } else {
        toast.error("Failed to load categories");
      }

      let product: any = null;

      if (productsRes.ok) {
        const pdata = await productsRes.json();
        if (pdata && !Array.isArray(pdata) && (pdata.id || pdata.slug)) {
          product = normaliseProduct(pdata);
        } else if (Array.isArray(pdata) && pdata.length > 0) {
          const found = pdata.find((p: any) => String(p.id) === id || p.slug === id) || pdata[0];
          product = normaliseProduct(found);
        }
      }

      if (!product) {
        const allRes = await fetch("/api/products");
        if (allRes.ok) {
          const allData = await allRes.json();
          const allProducts: ApiProduct[] = Array.isArray(allData) ? allData.map(normaliseProduct) : [];
          product = allProducts.find(p => String(p.id) === id || p.slug === id) || null;
        }
      }

      if (!product) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const isBathwareSub = [
        "toilets-wc", "wash-basins", "faucets-mixers", "showers",
        "bathroom-accessories", "bathroom-mirrors", "vanity-units",
        "kitchen-sinks-faucets", "plumbing-accessories"
      ].includes(product.subcategory || product.category);

      const computedMainCat = product.category === "bathware" || isBathwareSub ? "bathware" : "lighting";
      const computedSubCat = product.subcategory || (product.category !== "lighting" && product.category !== "bathware" ? product.category : "");

      setProductId(String(product.id));
      setOriginalSlug(product.slug || "");
      setForm({
        name:             product.name || "",
        mainCategory:     computedMainCat,
        category:         computedMainCat,
        subcategory:      computedSubCat,
        modelNumber:      product.modelNumber || "",
        shortDescription: product.shortDescription || "",
        description:      product.description || "",
        isFeatured:       product.isFeatured || false,
        isNew:            product.isNew || false,
        badge:            product.badge || "",
        images:           product.images?.length ? product.images : [""],
      });
      setFeatures(product.features?.length ? product.features : [""]);
      const sp = product.specifications ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: v as string })) : [{ key: "", value: "" }];
      setSpecs(sp.length ? sp : [{ key: "", value: "" }]);
    } catch {
      toast.error("Failed to load product");
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const specsObj: Record<string, string> = {};
    specs.filter(s => s.key.trim()).forEach(s => { specsObj[s.key.trim()] = s.value.trim(); });

    const payload = {
      name:              form.name.trim(),
      slug:              form.name.trim() !== "" ? buildSlug(form.name) : originalSlug,
      category:          form.mainCategory || form.category,
      subcategory:       form.subcategory,
      model_number:      form.modelNumber.trim(),
      short_description: form.shortDescription.trim(),
      description:       form.description.trim(),
      images:            images.filter(u => u.trim()),
      features:          features.filter(f => f.trim()),
      specifications:    specsObj,
      is_featured:       form.isFeatured,
      is_new:            form.isNew,
      badge:             form.badge.trim(),
    };

    const { error } = await updateProduct(productId, payload);

    if (error) {
      toast.error("Failed to save: " + error);
    } else {
      toast.success("Product updated successfully!");
      setSaving(false);
      router.push("/admin/products");
      return;
    }

    setSaving(false);
  };

  // convenience alias
  const images = form.images;
  const setImages = (imgs: string[]) => setForm(p => ({ ...p, images: imgs }));

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={28} className="text-gold animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="text-center py-24 space-y-4">
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <p className="text-white font-semibold">Product not found</p>
      <p className="text-white/30 text-sm">No product matches ID <code className="text-gold bg-white/5 px-2 py-0.5 rounded font-mono">{id}</code></p>
      <Link href="/admin/products" className="inline-flex items-center gap-2 bg-gold text-brand-dark font-bold px-6 py-3 rounded-xl transition-all hover:bg-gold-600">
        <ArrowLeft size={16} /> Back to Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-bold text-white">Edit Product</h2>
          <p className="text-white/30 text-sm truncate">{form.name}</p>
        </div>
        {/* Quick toggles */}
        <div className="hidden sm:flex items-center gap-2">
          <button type="button" onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.isFeatured ? "bg-gold/15 text-gold border-gold/25" : "bg-white/4 text-white/30 border-white/8 hover:border-white/20"}`}>
            <Star size={12} className={form.isFeatured ? "fill-gold" : ""} /> Featured
          </button>
          <button type="button" onClick={() => setForm(p => ({ ...p, isNew: !p.isNew }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.isNew ? "bg-green-500/15 text-green-400 border-green-500/25" : "bg-white/4 text-white/30 border-white/8 hover:border-white/20"}`}>
            <Sparkles size={12} /> New
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-5">
          <h3 className="font-semibold text-white text-sm">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={set} required className={inputCls} />
              {form.name && <p className="text-[10px] text-white/20 mt-1 font-mono">slug: {buildSlug(form.name)}</p>}
            </div>
            <div>
              <label className={labelCls}>Model Number</label>
              <input type="text" name="modelNumber" value={form.modelNumber} onChange={set} placeholder="e.g. OLS-PL-60W-001" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Main Category *</label>
              <select
                name="mainCategory"
                value={form.mainCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((p) => ({ ...p, mainCategory: val, category: val, subcategory: "" }));
                }}
                required
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Select Main Category…</option>
                <option value="lighting">Lighting & Electrical</option>
                <option value="bathware">Bathware & Sanitaryware</option>
              </select>
            </div>
            <div className="md:col-start-2">
              <label className={labelCls}>Subcategory *</label>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value }))}
                required
                disabled={!form.mainCategory}
                className={`${inputCls} cursor-pointer disabled:opacity-50`}
              >
                <option value="">
                  {!form.mainCategory ? "Select Main Category first…" : "Select subcategory…"}
                </option>
                {categories
                  .filter((c) => (c.mainCategory ?? c.main_category) === form.mainCategory)
                  .map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.icon && <span>{c.icon} </span>}{c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Short Description *</label>
            <input type="text" name="shortDescription" value={form.shortDescription} onChange={set} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Full Description</label>
            <textarea name="description" value={form.description} onChange={set} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Badge</label>
              <input type="text" name="badge" value={form.badge} onChange={set} placeholder="e.g. Best Seller" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={set} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-white/60">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={set} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-white/60">Mark as New Arrival</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ImagePlus size={14} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Product Images</h3>
          </div>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input type="url" value={img}
                onChange={e => { const u = [...images]; u[i] = e.target.value; setImages(u); }}
                placeholder={`Image ${i + 1} URL`} className={inputCls} />
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
              <Plus size={13} /> Add image
            </button>
          )}
          {images.some(u => u.startsWith("http")) && (
            <div className="flex gap-3 flex-wrap pt-1">
              {images.filter(u => u.startsWith("http")).map((url, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-white/8">
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
                placeholder="Name (e.g. Power)" className={inputCls} />
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

        <div className="flex gap-4 pt-1">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-50 text-brand-dark font-bold px-7 py-3 rounded-xl transition-all hover:shadow-gold-glow">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Changes</>}
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
