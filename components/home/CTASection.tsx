import Link from "next/link";
import { Phone, MessageCircle, MapPin, ArrowRight, Clock, Sparkles } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function CTASection() {
  return (
    <section className="section-padding bg-brand-obsidian relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gold/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-gold/20">
            <Sparkles size={12} />
            Let&apos;s Connect
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 tracking-wide leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-700 via-gold to-gold-light">
              Ready to Transform
            </span>
            <br />
            <span className="text-white">Your Space?</span>
          </h2>
          <p className="text-brand-text text-base max-w-2xl mx-auto font-light leading-relaxed">
            Visit our luxury showroom in Negombo or reach out today. Our architectural consultants are ready to help you choose the perfect lighting and bathware solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-brand-charcoal border border-brand-border hover:border-gold/50 rounded-2xl p-7 text-center transition-all duration-300 hover:shadow-card-hover group">
            <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
              <Phone size={22} className="text-gold" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">Call Us</h3>
            <p className="text-brand-text text-sm mb-1">{siteSettings.telephone}</p>
            <p className="text-brand-text/50 text-xs mb-6">{siteSettings.mobile}</p>
            <a
              href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:bg-gold/10"
            >
              Call Now <ArrowRight size={14} />
            </a>
          </div>

          <div className="bg-brand-charcoal border border-brand-border hover:border-green-500/50 rounded-2xl p-7 text-center transition-all duration-300 hover:shadow-card-hover group">
            <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500/20 transition-colors">
              <MessageCircle size={22} className="text-green-400" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">WhatsApp Us</h3>
            <p className="text-brand-text text-sm mb-1">Chat with a consultant</p>
            <p className="text-brand-text/50 text-xs mb-6">Immediate response guaranteed</p>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
            >
              Chat Now <ArrowRight size={14} />
            </a>
          </div>

          <div className="bg-brand-charcoal border border-brand-border hover:border-gold/50 rounded-2xl p-7 text-center transition-all duration-300 hover:shadow-card-hover group">
            <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
              <MapPin size={22} className="text-gold" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">Visit Showroom</h3>
            <p className="text-brand-text text-sm mb-1">591, Chilaw Road</p>
            <p className="text-brand-text/50 text-xs mb-6">Kattuwa, Negombo</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:bg-gold/10"
            >
              Get Directions <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold-600 text-brand-dark font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg hover:-translate-y-0.5 text-base"
          >
            Request Free Consultation
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="border-t border-brand-border pt-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-brand-text text-sm font-light">
              <Clock size={15} className="text-gold shrink-0" />
              <span>{siteSettings.businessHours.weekdays}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-brand-border" />
            <div className="flex items-center gap-2 text-brand-text text-sm font-light">
              <Clock size={15} className="text-gold shrink-0" />
              <span>{siteSettings.businessHours.saturday}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-brand-border" />
            <div className="flex items-center gap-2 text-brand-text/50 text-sm font-light">
              <Clock size={15} className="text-brand-text/30 shrink-0" />
              <span>{siteSettings.businessHours.sunday}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
