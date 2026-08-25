"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    image: "",
    year: "",
  });
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          highlights: highlights.filter((h) => h.trim() !== ""),
          tags: tags.filter((t) => t.trim() !== ""),
        }),
      });

      if (response.ok) {
        toast.success("Project created successfully");
        router.push("/admin/projects");
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-white mt-4">Add New Project</h1>
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
              placeholder="Project title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="Hospitality">Hospitality</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
                placeholder="2024"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
              placeholder="City, Country"
            />
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
              required
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 resize-none"
              placeholder="Project description..."
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Highlights</h3>
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
            >
              <Plus size={18} />
              Add Highlight
            </button>
          </div>
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleHighlightChange(index, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
                placeholder="Highlight point"
              />
              {highlights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Tags</h3>
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
            >
              <Plus size={18} />
              Add Tag
            </button>
          </div>
          {tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold/50"
                placeholder="Tag"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gold text-brand-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-3 rounded-lg font-semibold border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
