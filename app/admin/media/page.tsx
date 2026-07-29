"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Copy, Check, Image } from "lucide-react";
import toast from "react-hot-toast";

const sampleImages = [
  { id: "1", url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&q=80", name: "led-panel.jpg" },
  { id: "2", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", name: "chandelier.jpg" },
  { id: "3", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", name: "interior.jpg" },
  { id: "4", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", name: "outdoor.jpg" },
  { id: "5", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", name: "electrical.jpg" },
];

export default function AdminMediaPage() {
  const [images, setImages] = useState(sampleImages);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this image?")) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Image deleted");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Media Library</h2>
          <p className="text-brand-text text-sm">{images.length} images</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Upload size={18} /> Upload Images
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-brand-border rounded-2xl p-10 text-center hover:border-gold/40 transition-colors cursor-pointer bg-brand-charcoal"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} className="mx-auto mb-3 text-brand-text/30" />
        <p className="text-brand-text font-medium">Click to upload or drag and drop</p>
        <p className="text-sm text-brand-text/50 mt-1">PNG, JPG, WebP up to 10MB</p>
      </div>

      {/* Images grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-brand-charcoal rounded-xl border border-brand-border overflow-hidden hover:border-gold/30 hover:shadow-card transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-2 border-t border-brand-border">
              <p className="text-xs text-brand-text truncate">{img.name}</p>
            </div>
            <div className="absolute inset-0 bg-brand-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleCopy(img.url, img.id)}
                className="p-2 bg-brand-charcoal border border-brand-border rounded-lg hover:border-gold/40 transition-colors"
                title="Copy URL"
              >
                {copiedId === img.id
                  ? <Check size={14} className="text-green-400" />
                  : <Copy size={14} className="text-gold" />}
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                className="p-2 bg-brand-charcoal border border-brand-border rounded-lg hover:border-red-500/40 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty upload slot */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square bg-brand-charcoal rounded-xl border-2 border-dashed border-brand-border hover:border-gold/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Image size={24} className="text-brand-text/30" />
          <span className="text-xs text-brand-text/40">Add Image</span>
        </div>
      </div>
    </div>
  );
}
