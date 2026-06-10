import { Metadata } from "next";
import { Shield, Award, Users, Zap, Target, Eye, Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ocean Lighting Solutions – Sri Lanka's trusted importer and dealer of premium LED lighting and electrical solutions.",
};

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description: "We never compromise on quality. Every product we carry meets strict international standards.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description: "Our customers are at the heart of everything we do. Your satisfaction is our success.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We stay ahead of lighting technology trends to bring you the latest and most efficient solutions.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're proud to serve and contribute to the communities across Sri Lanka.",
  },
];

const team = [
  {
    name: "Managing Director",
    role: "Leadership & Vision",
    description: "Leading Ocean Lighting Solutions with a passion for quality and customer service.",
  },
  {
    name: "Technical Expert",
    role: "Product Specialist",
    description: "Ensuring every product meets our high standards and customer requirements.",
  },
  {
    name: "Sales Team",
    role: "Customer Relations",
    description: "Dedicated to helping customers find the perfect lighting solutions.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-20">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            About Us
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            Illuminating Sri Lanka Since Day One
          </h1>
          <p className="text-teal-200 max-w-2xl text-lg">
            Ocean Lighting Solutions is your trusted partner for premium LED lighting, electrical items, and interior solutions in Sri Lanka.
          </p>
        </div>
      </div>

      {/* Story section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Our Story
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Passion for Premium Lighting
              </h2>
              <div className="section-divider mb-6" />
              <div className="space-y-4 text-brand-text leading-relaxed">
                <p>
                  Ocean Lighting Solutions was founded with a simple mission: to bring world-class lighting solutions to Sri Lanka at accessible prices. Located in the heart of Negombo, we have grown to become one of the most trusted names in the lighting industry.
                </p>
                <p>
                  We import directly from leading manufacturers worldwide, ensuring our customers receive genuine, high-quality products with full warranty support. Our showroom at 591, Chilaw Road, Kattuwa, Negombo showcases hundreds of products across all categories.
                </p>
                <p>
                  From residential homes to luxury hotels, commercial offices to industrial facilities — we have the expertise and product range to illuminate any space beautifully and efficiently.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-card-hover">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80"
                  alt="Our Showroom"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center">
                    <Award size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">10+ Years</div>
                    <div className="text-sm text-brand-text">Serving Sri Lanka</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-brand-bg">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-brand-border hover:border-brand-primary hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center mb-5">
                <Target size={22} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-brand-text leading-relaxed">
                To provide Sri Lanka with access to premium, energy-efficient lighting solutions that enhance living and working environments while delivering exceptional value and service. We are committed to making quality lighting accessible to every home and business.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-brand-border hover:border-brand-primary hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 bg-teal-gradient rounded-xl flex items-center justify-center mb-5">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-brand-text leading-relaxed">
                To be Sri Lanka&apos;s most trusted and innovative lighting solutions provider, recognized for our commitment to quality, sustainability, and customer satisfaction. We envision a future where every space in Sri Lanka is beautifully and efficiently illuminated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Our Values
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <div className="section-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 bg-brand-bg rounded-2xl border border-brand-border hover:border-brand-primary hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-teal-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-brand-text leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-teal-gradient">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
            {[
              { value: "10+", label: "Years in Business" },
              { value: "500+", label: "Products Available" },
              { value: "1000+", label: "Happy Customers" },
              { value: "50+", label: "Premium Brands" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl md:text-5xl font-bold mb-2 glow-text">{stat.value}</div>
                <div className="text-teal-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Visit Our Showroom
          </h2>
          <p className="text-brand-text max-w-xl mx-auto mb-8">
            Experience our full product range in person. Our team is ready to help you find the perfect lighting solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-teal-glow"
            >
              Get in Touch
            </Link>
            <Link
              href="/products"
              className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
