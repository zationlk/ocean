import { Metadata } from "next";
import { Shield, Award, Users, Zap, Target, Eye, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ocean Lighting Solutions – Sri Lanka's trusted supplier of premium LED lighting, electrical items, and quality bathware in Negombo.",
};

const values = [
  { icon: Shield, title: "Quality First",        description: "Every product we carry meets strict quality standards — from LED fittings to bathroom ceramics." },
  { icon: Heart, title: "Customer Focus",         description: "Your satisfaction drives us. Our team provides personalised guidance for every project, big or small." },
  { icon: Zap,   title: "Innovation",             description: "We keep pace with global trends — smart lighting, anti-fog mirrors, water-saving faucets and more." },
  { icon: Users, title: "Island-Wide Service",    description: "We proudly serve homes, hotels and commercial spaces across Sri Lanka with reliable delivery." },
];

const stats = [
  { value: "10+",   label: "Years in Business" },
  { value: "34+",   label: "Products in Catalogue" },
  { value: "1000+", label: "Happy Customers" },
  { value: "19",    label: "Product Categories" },
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
            <Sparkles size={12} /> Our Story
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-wide max-w-2xl leading-tight">
            Lighting &amp; Bathware Excellence Since Day One
          </h1>
          <p className="text-brand-text max-w-2xl text-base font-light leading-relaxed">
            Ocean Lighting Solutions is Sri Lanka&apos;s trusted destination for premium LED lighting, electrical items, and quality bathware — all from our showroom in Negombo.
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
                A Passion for Quality Spaces
              </h2>
              <div className="w-16 h-px bg-gold mb-6" />
              <div className="space-y-5 text-brand-text leading-relaxed font-light text-sm md:text-base">
                <p>
                  Ocean Lighting Solutions was founded with a clear mission — to bring quality LED lighting, electrical products, and bathware to Sri Lanka at accessible prices. Based in Negombo, we have grown into a trusted destination for homeowners, interior designers, architects, and commercial clients.
                </p>
                <p>
                  We import directly from reliable international manufacturers and local distributors, ensuring every product is genuine, high-performing, and backed by warranty support. Our showroom at 591, Chilaw Road, Kattuwa, Negombo showcases our full range across 19 product categories.
                </p>
                <p>
                  Whether you are fitting out a new home, renovating a hotel, or upgrading a commercial space — our experienced team will help you choose the right products at the right price.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-brand-border">
                <img
                  src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=700&q=80"
                  alt="Ocean Lighting Solutions Showroom"
                  className="w-full h-[450px] object-cover"
                />
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
              Mission &amp; Vision
            </h2>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To provide Sri Lanka with reliable, energy-efficient LED lighting, quality electrical items, and premium bathware solutions. We are committed to delivering great value, strong product performance, and genuine customer support for every project.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To be Sri Lanka's most trusted supplier of LED lighting and bathware — recognised for consistent product quality, fair pricing, and outstanding service from our showroom in Negombo to customers across the island.",
              },
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
              What Drives Our Team
            </h2>
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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
            Visit Our Negombo Showroom
          </h2>
          <p className="text-brand-text max-w-xl mx-auto mb-8 font-light leading-relaxed text-sm">
            See our complete range of LED lighting, bathware, and electrical items in person. Our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-gold hover:bg-gold-600 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow">
              Get in Touch
            </Link>
            <Link href="/lighting" className="border-2 border-gold/50 text-gold hover:bg-gold hover:text-brand-dark font-bold px-8 py-4 rounded-xl transition-all duration-300">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
