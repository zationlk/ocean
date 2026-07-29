import { Metadata } from "next";
import { Shield, Award, Users, Zap, Target, Eye, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about OCEAN Lighting Solutions – Sri Lanka's trusted importer of premium LED lighting and exclusive OCEANA luxury bathware solutions.",
};

const values = [
  { icon: Shield, title: "Quality First", description: "We never compromise. Every imported fixture and ceramic suite meets strict international standards." },
  { icon: Heart, title: "Bespoke Service", description: "Our customers are at the heart of our craft. Custom design consultancies guarantee satisfaction." },
  { icon: Zap, title: "Sleek Innovation", description: "We track global design trends to deliver smart toilets, anti-fog mirrors, and CCT changeable LEDs." },
  { icon: Users, title: "Island-Wide Prestige", description: "We are proud to furnish landmark luxury resorts and fine residential properties across Sri Lanka." },
];

const stats = [
  { value: "10+", label: "Years in Business" },
  { value: "500+", label: "Masterpiece Collections" },
  { value: "1000+", label: "Premium Projects" },
  { value: "50+", label: "Global Brand Partners" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-obsidian">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-20 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gold blur-3xl rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
            <Sparkles size={12} />
            Our Story
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-wide max-w-2xl leading-tight">
            Redefining Light &amp; Water Since Day One
          </h1>
          <p className="text-brand-text max-w-2xl text-base font-light leading-relaxed">
            OCEAN Lighting Solutions is Sri Lanka&apos;s premier dealer of high-end LED lighting and exclusive OCEANA designer bathware collections.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding bg-brand-charcoal">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
                <Sparkles size={12} /> Our Heritage
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide">
                A Passion for Elite Living Spaces
              </h2>
              <div className="w-16 h-px bg-gold mb-6" />
              <div className="space-y-5 text-brand-text leading-relaxed font-light text-sm md:text-base">
                <p>OCEAN Lighting Solutions was established with a singular vision: to bring world-class, premium architectural lighting and luxury designer bathware to Sri Lanka. Headquartered in Negombo, we have evolved into a distinguished destination for architects, interior designers, and discerning homeowners.</p>
                <p>By importing directly from top-tier international manufacturers, we guarantee authentic, high-performance fixtures with comprehensive warranty support. Our showroom at 591, Chilaw Road, Kattuwa, Negombo houses display zones designed to inspire custom layouts.</p>
                <p>Whether illuminating a boutique ocean-front villa or supplying OCEANA smart sanitaryware for premium high-rise suites, our expertise and curated collections bring your concepts to life.</p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-brand-border">
                <img src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=700&q=80" alt="OCEAN Showroom" className="w-full h-[450px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-obsidian rounded-2xl border border-brand-border p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center">
                    <Award size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl">10+ Years</div>
                    <div className="text-xs text-brand-text">Serving Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-brand-obsidian">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
              <Sparkles size={12} /> Our Purpose
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">Mission &amp; Vision</h2>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: "Our Mission", text: "To provide Sri Lanka with premium, energy-efficient LED lighting and designer OCEANA bathware solutions. We are dedicated to delivering unmatched durability, high aesthetic value, and professional consulting support for custom home builds." },
              { icon: Eye, title: "Our Vision", text: "To be the foremost luxury LED lighting and OCEANA designer bathware destination in South Asia, recognized for our commitment to green technology, premium product design, and absolute customer loyalty." },
            ].map((item) => (
              <div key={item.title} className="bg-brand-charcoal rounded-2xl p-8 border border-brand-border hover:border-gold/30 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-4 tracking-wide">{item.title}</h3>
                <p className="text-brand-text leading-relaxed font-light text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-charcoal">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-gold/20">
              <Sparkles size={12} /> Core Pillars
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">What Drives Our Team</h2>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6 bg-brand-obsidian rounded-2xl border border-brand-border hover:border-gold/30 hover:shadow-card transition-all duration-300 group">
                <div className="w-14 h-14 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-xs text-brand-text font-light leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gold-gradient border-y border-gold/10">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-brand-dark">{stat.value}</div>
                <div className="text-brand-dark/75 font-semibold text-xs tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-obsidian border-t border-brand-border">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">Visit Our Negombo Showroom</h2>
          <p className="text-brand-text max-w-xl mx-auto mb-8 font-light leading-relaxed text-sm">
            Experience our complete collections of luxury indoor chandeliers, smart OCEANA bathroom cabinets, and rainfall shower modules in person.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-gold hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow">
              Get in Touch
            </Link>
            <Link href="/products" className="border-2 border-gold/50 text-gold hover:bg-gold hover:text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
