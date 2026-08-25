"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string;
  created_at: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Gallery item deleted successfully");
        fetchItems();
      } else {
        toast.error("Failed to delete gallery item");
      }
    } catch (error) {
      console.error("Failed to delete gallery item:", error);
      toast.error("Failed to delete gallery item");
    }
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading gallery items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-white/40 text-sm mt-1">Manage your gallery images</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 bg-gold text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
        >
          <Plus size={18} />
          Add Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-white/30" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/40">
            No gallery items found
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-gold/30 transition-colors"
            >
              <div className="aspect-square relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
                <p className="text-white/40 text-xs mt-1">{item.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
