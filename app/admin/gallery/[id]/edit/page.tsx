"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string;
}

export default function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    const loadItem = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/gallery?id=${id}`);
        if (response.ok) {
          const data: GalleryItem = await response.json();
          setFormData({
            title: data.title,
            description: data.description || "",
            image: data.image,
            category: data.category,
          });
        } else {
          toast.error("Failed to load gallery item");
          router.push("/admin/gallery");
        }
      } catch (error) {
        console.error("Failed to load gallery item:", error);
        toast.error("Failed to load gallery item");
        router.push("/admin/gallery");
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [params, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { id } = await params;
      const response = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...formData,
        }),
      });

      if (response.ok) {
        toast.success("Gallery item updated successfully");
        router.push("/admin/gallery");
      } else {
        toast.error("Failed to update gallery item");
      }
    } catch (error) {
      console.error("Failed to update gallery item:", error);
      toast.error("Failed to update gallery item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading gallery item...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Gallery
        </Link>
        <h1 className="text-2xl font-bold text-white mt-4">Edit Gallery Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
              placeholder="Gallery item title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
            >
              <option value="">Select category</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 resize-none"
              placeholder="Description (optional)"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gold text-brand-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/gallery"
            className="px-6 py-3 rounded-lg font-semibold border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
