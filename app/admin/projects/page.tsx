"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  highlights: string[];
  tags: string[];
  year: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-white/40 text-sm mt-1">Manage your project portfolio</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-gold text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
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

      {/* Projects Grid */}
      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            No projects found
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{project.title}</h3>
                  <p className="text-white/40 text-sm mt-1">{project.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-xs text-white/30">{project.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
