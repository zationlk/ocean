import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
          <p className="text-teal-200 mt-2">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-custom py-12 max-w-3xl">
        <div className="bg-white rounded-2xl border border-brand-border p-8 space-y-6">
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-brand-text">By accessing and using the Ocean Lighting Solutions website, you accept and agree to be bound by these Terms of Service.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">2. Product Information</h2>
            <p className="text-brand-text">All product information, specifications, and images are provided for informational purposes. Actual products may vary slightly from images shown. Prices are subject to change without notice.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">3. Intellectual Property</h2>
            <p className="text-brand-text">All content on this website, including text, images, and logos, is the property of Ocean Lighting Solutions and is protected by applicable intellectual property laws.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">4. Contact</h2>
            <p className="text-brand-text">For questions about these Terms, contact us at oceanlighting303@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
