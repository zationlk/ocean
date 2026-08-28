"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Sparkles, CheckCircle, Package } from "lucide-react";

const categoryColors: Record<string, string> = {
  Hospitality: "bg-purple-50 text-purple-700 border border-purple-100",
  Commercial: "bg-blue-50 text-blue-700 border border-blue-100",
  Residential: "bg-amber-50 text-amber-700 border border-amber-100",
  Outdoor: "bg-green-50 text-green-700 border border-green-100",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-20 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold blur-3xl rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4.5 py-1.5 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
            <Building2 size={12} className="text-gold" />
            Our Portfolio
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-wide max-w-2xl">
            Exquisite Design, Absolute Quality
          </h1>
          <p className="text-gray-300 max-w-xl text-base md:text-lg font-light leading-relaxed">
            From high-profile boutique hotels to private penthouses, explore how OCEAN Lighting Solutions transforms architectural spaces across Sri Lanka.
          </p>
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: "200+", label: "Completed Projects" },
              { value: "50%", label: "Average Water & Energy Savings" },
              { value: "12+", label: "Design Awards" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-gold">{s.value}</div>
                <div className="text-gray-400 text-xs tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project: any, index: number) => (
            <div
              key={project.id}
              className={`bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden hover:border-gold/30 hover:shadow-card-hover transition-all duration-300 group ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "h-80" : "h-64"}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${
                      categoryColors[project.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                    {project.year}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm">
                  <MapPin size={14} className="text-gold" />
                  {project.location}
                </div>
              </div>

              <div className={`p-6 ${index === 0 ? "grid md:grid-cols-2 gap-8" : ""}`}>
                <div>
                  <h2 className="font-display text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors tracking-wide">
                    {project.title}
                  </h2>
                  <p className="text-brand-text text-sm leading-relaxed mb-4 font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs bg-gold-50 text-gold-700 font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    Project Highlights
                  </h3>
                  <ul className="space-y-2">
                    {project.highlights.map((h: string) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-brand-text font-light">
                        <CheckCircle size={14} className="text-gold mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gold-gradient rounded-2xl p-10 text-brand-dark text-center border border-gold/10">
          <h2 className="font-display text-3xl font-bold mb-3 tracking-wide">
            Have a Bespoke Project in Mind?
          </h2>
          <p className="text-brand-dark/85 mb-8 max-w-lg mx-auto font-light text-sm">
            Whether it is planning lighting grids for a custom home build or procuring elite bath fittings for hotel villas, let us collaborate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-brand-dark text-white hover:bg-black font-bold px-8 py-4 rounded-xl transition-colors shadow-md"
            >
              Start Consultation
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/lighting"
              className="flex items-center gap-2 bg-transparent hover:bg-brand-dark/10 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all border border-brand-dark/25"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
