import Link from "next/link";
import { Phone, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function CTASection() {
  return (
    <section className="section-padding bg-hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center text-white mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            Visit our showroom in Negombo or contact us today. Our lighting experts are ready to help you find the perfect solution.
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Phone,
              title: "Call Us",
              description: siteSettings.telephone,
              sub: siteSettings.mobile,
              href: `tel:${siteSettings.telephone.replace(/\s/g, "")}`,
              label: "Call Now",
              color: "bg-blue-500 hover:bg-blue-600",
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              description: "Chat with us instantly",
              sub: "Quick response guaranteed",
              href: `https://wa.me/${siteSettings.whatsapp}`,
              label: "Chat Now",
              color: "bg-green-500 hover:bg-green-600",
            },
            {
              icon: MapPin,
              title: "Visit Showroom",
              description: "591, Chilaw Road",
              sub: "Kattuwa, Negombo",
              href: "/contact",
              label: "Get Directions",
              color: "bg-brand-primary hover:bg-brand-dark",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-teal-200 text-sm mb-1">{item.description}</p>
              <p className="text-teal-300 text-xs mb-5">{item.sub}</p>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center gap-2 ${item.color} text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors`}
              >
                {item.label}
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-brand-primary font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Request a Free Quote
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
