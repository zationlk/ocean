"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewGalleryItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Gallery item created successfully");
        router.push("/admin/gallery");
      } else {
        toast.error("Failed to create gallery item");
      }
    } catch (error) {
      console.error("Failed to create gallery item:", error);
      toast.error("Failed to create gallery item");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-white mt-4">Add New Gallery Item</h1>
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
            disabled={loading}
            className="flex-1 bg-gold text-brand-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Item"}
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
