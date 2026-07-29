"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { siteSettings } from "@/lib/data";
import toast from "react-hot-toast";

const inputClass = "w-full px-4 py-3 bg-brand-obsidian text-white border border-brand-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-brand-text/30";
const labelClass = "block text-xs font-semibold text-brand-text/70 uppercase tracking-wider mb-2";
const cardClass = "bg-brand-charcoal rounded-2xl border border-brand-border p-6 space-y-5";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(siteSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Site Settings</h2>
        <p className="text-brand-text text-sm">Manage your website content and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cardClass}>
          <h3 className="font-semibold text-white">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { name: "companyName", label: "Company Name" },
              { name: "tagline", label: "Tagline" },
              { name: "email", label: "Email" },
              { name: "website", label: "Website" },
              { name: "telephone", label: "Telephone" },
              { name: "mobile", label: "Mobile" },
              { name: "whatsapp", label: "WhatsApp Number" },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={(settings as unknown as Record<string, string>)[field.name] || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input type="text" name="address" value={settings.address} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="font-semibold text-white">Homepage Content</h3>
          <div>
            <label className={labelClass}>Hero Title</label>
            <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hero Subtitle</label>
            <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>About Text</label>
            <textarea name="aboutText" value={settings.aboutText} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Meta Description (SEO)</label>
            <textarea name="metaDescription" value={settings.metaDescription} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gold hover:bg-gold-600 disabled:opacity-60 text-brand-dark font-bold px-6 py-3 rounded-xl transition-colors hover:shadow-gold-glow"
        >
          {isSubmitting ? <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
