import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Lightbulb, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore our completed lighting projects across Sri Lanka — hotels, residences, offices, and outdoor spaces transformed by Ocean Lighting Solutions.",
};

const projects = [
  {
    id: "proj-1",
    title: "Serenity Beach Resort – Full Lighting Renovation",
    category: "Hospitality",
    location: "Negombo, Sri Lanka",
    description:
      "A complete lighting overhaul of a 5-star beachfront resort. We supplied and installed over 800 LED fixtures covering lobby chandeliers, room lighting, restaurant ambiance, pool lighting, and exterior facade illumination.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    highlights: [
      "800+ LED fixtures installed",
      "60% energy reduction achieved",
      "3-day installation timeline",
      "Custom chandelier design",
    ],
    tags: ["Commercial", "LED", "Interior", "Outdoor"],
    year: "2024",
  },
  {
    id: "proj-2",
    title: "Luxe Interiors – Modern Office Complex",
    category: "Commercial",
    location: "Colombo, Sri Lanka",
    description:
      "Design and supply of a full LED panel lighting system for a 6-floor office complex. The project focused on energy efficiency, uniform light distribution, and a clean modern aesthetic that boosts productivity.",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
    highlights: [
      "Complete 6-floor LED panel system",
      "Smart dimming controls",
      "CRI >90 for accurate colour rendering",
      "Annual savings of Rs. 2.4M in electricity",
    ],
    tags: ["Commercial", "LED Panels", "Smart Lighting"],
    year: "2024",
  },
  {
    id: "proj-3",
    title: "Residential Villa – Luxury Interior Design",
    category: "Residential",
    location: "Kandy, Sri Lanka",
    description:
      "Bespoke interior lighting design for a luxury private villa. The project featured crystal chandeliers, recessed LED downlights, warm accent lighting, and a smart control system allowing full scene customisation.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    highlights: [
      "Custom crystal chandelier installation",
      "Smart lighting scenes via app",
      "12 unique lighting zones",
      "Premium brass & glass fixtures",
    ],
    tags: ["Residential", "Interior", "Smart", "Premium"],
    year: "2023",
  },
  {
    id: "proj-4",
    title: "Sakura Gardens – Landscape Lighting",
    category: "Outdoor",
    location: "Galle, Sri Lanka",
    description:
      "A comprehensive outdoor landscape lighting project for a private botanical garden. Solar garden spikes, LED path lights, colour-changing underwater pond lights, and high-powered flood lights were deployed.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    highlights: [
      "100% solar-powered garden lights",
      "IP66-rated weatherproof fixtures",
      "Underwater LED pond lighting",
      "Automated dusk-to-dawn control",
    ],
    tags: ["Outdoor", "Solar", "Landscape"],
    year: "2023",
  },
  {
    id: "proj-5",
    title: "Café Umber – Restaurant Ambiance",
    category: "Food & Beverage",
    location: "Negombo, Sri Lanka",
    description:
      "Warm, inviting ambiance lighting design for a boutique café. The solution combined Nordic pendant lights, warm LED strip underlighting, and dimmer-controlled spots to create an Instagram-worthy dining atmosphere.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    highlights: [
      "Nordic pendant light feature wall",
      "Dimmable warm-white system",
      "LED strip bar underlighting",
      "Custom track lighting over counter",
    ],
    tags: ["F&B", "Interior", "Ambient"],
    year: "2023",
  },
  {
    id: "proj-6",
    title: "NTC Industrial Warehouse – High Bay LED",
    category: "Industrial",
    location: "Katunayake, Sri Lanka",
    description:
      "Installation of 150W industrial high bay LED fixtures across a 20,000 sqft warehouse. The upgrade replaced old metal halide fixtures, dramatically improving light levels while cutting energy costs in half.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80",
    highlights: [
      "120 high bay LEDs installed",
      "50% energy cost reduction",
      "Instant-start, no warm-up time",
      "IP65-rated for dusty environment",
    ],
    tags: ["Industrial", "LED", "Energy Saving"],
    year: "2024",
  },
];

const categoryColors: Record<string, string> = {
  Hospitality: "bg-purple-100 text-purple-700",
  Commercial: "bg-blue-100 text-blue-700",
  Residential: "bg-amber-100 text-amber-700",
  Outdoor: "bg-green-100 text-green-700",
  "Food & Beverage": "bg-orange-100 text-orange-700",
  Industrial: "bg-gray-100 text-gray-700",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-20">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            <Building2 size={14} />
            Our Projects
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            Real Projects, Real Results
          </h1>
          <p className="text-teal-200 max-w-xl text-lg leading-relaxed">
            From luxury hotels to industrial warehouses, we&apos;ve transformed hundreds of spaces across Sri Lanka with premium lighting solutions.
          </p>
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: "200+", label: "Projects Completed" },
              { value: "60%", label: "Avg. Energy Savings" },
              { value: "10+", label: "Industries Served" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-teal-300">{s.value}</div>
                <div className="text-teal-200 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`bg-white rounded-2xl border border-brand-border overflow-hidden hover:border-brand-primary hover:shadow-card-hover transition-all duration-300 group ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "h-80" : "h-56"}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      categoryColors[project.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white backdrop-blur-sm">
                    {project.year}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm">
                  <MapPin size={14} className="text-teal-300" />
                  {project.location}
                </div>
              </div>

              <div className={`p-6 ${index === 0 ? "grid md:grid-cols-2 gap-8" : ""}`}>
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-brand-text text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-teal-50 text-brand-primary font-medium px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-brand-primary" />
                    Project Highlights
                  </h3>
                  <ul className="space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-brand-text">
                        <CheckCircle size={14} className="text-brand-primary mt-0.5 shrink-0" />
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
        <div className="mt-16 bg-teal-gradient rounded-2xl p-10 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-3">
            Have a Project in Mind?
          </h2>
          <p className="text-teal-200 mb-8 max-w-lg mx-auto">
            Whether it&apos;s a single room or an entire building, our team will design the perfect lighting solution for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-white text-brand-primary font-semibold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Start Your Project
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
