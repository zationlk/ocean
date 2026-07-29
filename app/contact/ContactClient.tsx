"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from "lucide-react";
import { siteSettings } from "@/lib/data";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("inquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        status: "unread",
      });
      if (error) {
        toast.error("Failed to send message. Please try again.");
        return;
      }
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoCards = [
    { icon: MapPin, title: "Visit Our Showroom", lines: [siteSettings.address], href: undefined as string | undefined },
    { icon: Phone, title: "Call Us", lines: [siteSettings.telephone, siteSettings.mobile], href: `tel:${siteSettings.telephone.replace(/\s/g, "")}` },
    { icon: Mail, title: "Email Us", lines: [siteSettings.email], href: `mailto:${siteSettings.email}` },
    { icon: Clock, title: "Business Hours", lines: [siteSettings.businessHours.weekdays, siteSettings.businessHours.saturday, siteSettings.businessHours.sunday], href: undefined as string | undefined },
  ];

  const inputClass = "w-full px-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder:text-brand-text/30";

  return (
    <div className="min-h-screen bg-brand-obsidian">
      <div className="bg-hero-gradient text-white py-20 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold blur-3xl rounded-full" />
        </div>
        <div className="container-custom relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-4 text-xs font-bold tracking-widest text-gold uppercase">
            <Sparkles size={12} />
            Contact Us
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-wide">Get in Touch</h1>
          <p className="text-brand-text max-w-xl font-light text-sm leading-relaxed">
            Have a question about our collections or need a bespoke quote? We are here to help.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {infoCards.map((item) => (
              <div key={item.title} className="bg-brand-charcoal rounded-2xl p-5 border border-brand-border hover:border-gold/30 hover:shadow-card transition-all duration-300">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                    {item.lines.map((line, i) =>
                      item.href ? (
                        <a key={i} href={item.href} className="block text-sm text-brand-text hover:text-gold transition-colors font-light">{line}</a>
                      ) : (
                        <p key={i} className="text-sm text-brand-text font-light">{line}</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold p-5 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <div className="font-semibold text-sm tracking-wider uppercase">Chat on WhatsApp</div>
                <div className="text-green-100 text-xs font-light mt-0.5">Quick response guaranteed</div>
              </div>
            </a>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-wide">Send Us a Message</h2>
              <p className="text-brand-text mb-8 font-light text-sm">Fill out the form below and our team will contact you within 24 hours.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-2">Message Sent!</h3>
                  <p className="text-brand-text mb-6 font-light text-sm">Thank you for contacting us. We will get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-gold hover:bg-gold-600 text-brand-dark font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2">Email Address <span className="text-red-400">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="07X XXX XXXX" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2">Subject <span className="text-red-400">*</span></label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className={inputClass}>
                        <option value="">Select a subject</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="quote-request">Quote Request</option>
                        <option value="installation">Installation Query</option>
                        <option value="warranty">Warranty / Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2">Message <span className="text-red-400">*</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us about your requirements..." className={`${inputClass} resize-none`} />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-gold-glow"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />Sending...</>
                    ) : (
                      <><Send size={18} />Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden">
              <div className="p-5 border-b border-brand-border">
                <h3 className="font-semibold text-white mb-1">Find Us on the Map</h3>
                <p className="text-sm text-brand-text font-light">{siteSettings.address}</p>
              </div>
              <div className="h-64 bg-brand-obsidian">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5!2d79.8!3d7.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNy4yLCA3OS44!5e0!3m2!1sen!2slk!4v1"
                  width="100%"
                  height="256"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="OCEAN Lighting Solutions Location Map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
