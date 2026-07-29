import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="text-gold mt-2">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-custom py-12 max-w-3xl">
        <div className="bg-brand-charcoal rounded-2xl border border-brand-border p-8 space-y-6 max-w-none">
          <section>
            <h2 className="font-display text-xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-brand-text">We collect information you provide directly to us, such as when you fill out a contact form, including your name, email address, phone number, and message content.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p className="text-brand-text">We use the information we collect to respond to your inquiries, provide customer support, and improve our services. We do not sell or share your personal information with third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-white">3. Contact Us</h2>
            <p className="text-brand-text">If you have questions about this Privacy Policy, please contact us at oceanlighting303@gmail.com or visit our showroom at 591, Chilaw Road, Kattuwa, Negombo, Sri Lanka.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
