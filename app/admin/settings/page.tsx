"use client";

import { useState } from "react";
import { Save, Globe, Phone, MapPin, Clock } from "lucide-react";
import { siteSettings } from "@/lib/data";
import toast from "react-hot-toast";

const inputCls = "w-full px-4 py-3 bg-brand-obsidian text-white border border-white/8 rounded-xl text-sm outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/8 transition-all placeholder:text-white/20";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2";
const cardCls  = "bg-[#0d0d10] rounded-2xl border border-white/6 p-6 space-y-5";

export default function AdminSettingsPage() {
  const [settings, setSettings]     = useState(siteSettings);
  const [isSubmitting, setSubmitting] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Settings saved!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Site Settings</h2>
        <p className="text-white/30 text-sm mt-0.5">Manage website content and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company info */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-1">
            <Globe size={15} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Company Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ name: "companyName", label: "Company Name" }, { name: "tagline", label: "Tagline" }, { name: "email", label: "Email" }, { name: "website", label: "Website" }].map(f => (
              <div key={f.name}>
                <label className={labelCls}>{f.label}</label>
                <input type="text" name={f.name} value={(settings as Record<string, string>)[f.name] || ""} onChange={set} className={inputCls} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className={labelCls}>Address</label>
              <input type="text" name="address" value={settings.address} onChange={set} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-1">
            <Phone size={15} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ name: "telephone", label: "Telephone" }, { name: "mobile", label: "Mobile" }, { name: "whatsapp", label: "WhatsApp (with country code)" }].map(f => (
              <div key={f.name}>
                <label className={labelCls}>{f.label}</label>
                <input type="text" name={f.name} value={(settings as Record<string, string>)[f.name] || ""} onChange={set} className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        {/* Business hours */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={15} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Business Hours</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Weekdays</label>
              <input type="text" name="weekdays" value={settings.businessHours.weekdays} onChange={e => setSettings(p => ({ ...p, businessHours: { ...p.businessHours, weekdays: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Saturday</label>
              <input type="text" name="saturday" value={settings.businessHours.saturday} onChange={e => setSettings(p => ({ ...p, businessHours: { ...p.businessHours, saturday: e.target.value } }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sunday</label>
              <input type="text" name="sunday" value={settings.businessHours.sunday} onChange={e => setSettings(p => ({ ...p, businessHours: { ...p.businessHours, sunday: e.target.value } }))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Homepage content */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={15} className="text-gold/60" />
            <h3 className="font-semibold text-white text-sm">Homepage Content</h3>
          </div>
          <div>
            <label className={labelCls}>Hero Title</label>
            <input type="text" name="heroTitle" value={settings.heroTitle} onChange={set} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero Subtitle</label>
            <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={set} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>About Text</label>
            <textarea name="aboutText" value={settings.aboutText} onChange={set} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Meta Description (SEO)</label>
            <textarea name="metaDescription" value={settings.metaDescription} onChange={set} rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-brand-dark font-bold px-6 py-3 rounded-xl transition-all hover:shadow-gold-glow">
          {isSubmitting ? <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" /> : <Save size={16} />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
