"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { siteSettings } from "@/lib/data";
import toast from "react-hot-toast";

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
        <h2 className="font-display text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-brand-text text-sm">Manage your website content and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company info */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Company Information</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={(settings as unknown as Record<string, string>)[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Homepage Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={settings.heroTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text</label>
            <textarea
              name="aboutText"
              value={settings.aboutText}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description (SEO)</label>
            <textarea
              name="metaDescription"
              value={settings.metaDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand-primary transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Settings
        </button>
      </form>
    </div>
  );
}
