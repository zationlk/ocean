"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

const sampleImages = [
  { id: "1", url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&q=80", name: "led-panel.jpg", size: "248 KB" },
  { id: "2", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", name: "chandelier.jpg", size: "312 KB" },
  { id: "3", url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&q=80", name: "bathtub.jpg", size: "195 KB" },
  { id: "4", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", name: "outdoor.jpg", size: "281 KB" },
  { id: "5", url: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=400&q=80", name: "faucet.jpg", size: "167 KB" },
  { id: "6", url: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=400&q=80", name: "shower.jpg", size: "220 KB" },
];

export default function AdminMediaPage() {
  const [images, setImages]     = useState(sampleImages);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef            = useRef<HTMLInputElement>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this image?")) {
      setImages(p => p.filter(img => img.id !== id));
      toast.success("Image deleted");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    toast.success(`${files.length} file(s) ready to upload`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Media Library</h2>
          <p className="text-white/30 text-sm mt-0.5">{images.length} images</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-gold-glow">
          <Upload size={17} /> Upload
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/8 hover:border-gold/30 rounded-2xl p-10 text-center cursor-pointer transition-all group"
      >
        <Upload size={28} className="mx-auto mb-3 text-white/15 group-hover:text-gold/40 transition-colors" />
        <p className="text-white/30 text-sm font-medium group-hover:text-white/50 transition-colors">Click to upload or drag & drop</p>
        <p className="text-white/15 text-xs mt-1">PNG, JPG, WebP up to 10MB</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img.id} className="group relative bg-[#0d0d10] rounded-xl border border-white/6 overflow-hidden hover:border-white/12 transition-all"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            <div className="aspect-square overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-2.5 border-t border-white/5">
              <p className="text-[11px] text-white/40 truncate">{img.name}</p>
              <p className="text-[10px] text-white/20">{img.size}</p>
            </div>

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => handleCopy(img.url, img.id)}
                className="p-2 bg-[#0d0d10] border border-white/10 rounded-xl hover:border-gold/30 transition-all" title="Copy URL">
                {copiedId === img.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gold/70" />}
              </button>
              <a href={img.url} target="_blank" rel="noopener noreferrer"
                className="p-2 bg-[#0d0d10] border border-white/10 rounded-xl hover:border-gold/30 transition-all" title="Open in tab">
                <LinkIcon size={14} className="text-white/50" />
              </a>
              <button onClick={() => handleDelete(img.id)}
                className="p-2 bg-[#0d0d10] border border-white/10 rounded-xl hover:border-red-500/30 transition-all" title="Delete">
                <Trash2 size={14} className="text-red-400/70" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload slot */}
        <div onClick={() => fileInputRef.current?.click()}
          className="aspect-square bg-[#0d0d10] rounded-xl border-2 border-dashed border-white/6 hover:border-gold/25 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
          <ImageIcon size={22} className="text-white/15 group-hover:text-gold/30 transition-colors" />
          <span className="text-[11px] text-white/20 group-hover:text-white/40 transition-colors">Add Image</span>
        </div>
      </div>
    </div>
  );
}
