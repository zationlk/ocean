"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What types of lighting products do you carry?",
    answer:
      "We carry a comprehensive range including LED panel lights, chandeliers, pendant lights, track lighting, outdoor flood lights, solar garden lights, LED strip lights, industrial high bay lights, and much more. We also stock electrical items like MCB distribution boards and interior solutions.",
  },
  {
    question: "Do you offer island-wide delivery?",
    answer:
      "Yes, we deliver across Sri Lanka. Delivery charges and timelines vary by location. Please contact us for specific delivery information for your area.",
  },
  {
    question: "What warranty do your products come with?",
    answer:
      "Warranty periods vary by product and brand, typically ranging from 1 to 5 years. All warranty details are provided at the time of purchase. We handle warranty claims directly with manufacturers on your behalf.",
  },
  {
    question: "Can I visit your showroom to see products in person?",
    answer:
      "Absolutely! We encourage you to visit our showroom at 591, Chilaw Road, Kattuwa, Negombo. Our team will be happy to demonstrate products and help you choose the right solutions. We're open Monday to Friday 8AM–6PM and Saturday 8AM–4PM.",
  },
  {
    question: "Do you provide installation services?",
    answer:
      "We can recommend trusted electricians and installation professionals in the Negombo area. For large commercial projects, we can coordinate installation as part of a complete solution package.",
  },
  {
    question: "Can I get a bulk discount for large orders?",
    answer:
      "Yes, we offer competitive pricing for bulk orders and commercial projects. Please contact us with your requirements and we'll provide a customized quote.",
  },
  {
    question: "How do I know which LED light is right for my space?",
    answer:
      "Our team of lighting experts can help you choose the right products based on your space size, ceiling height, desired ambiance, and budget. Visit our showroom or contact us via WhatsApp or phone for personalized advice.",
  },
  {
    question: "Do you carry smart lighting products?",
    answer:
      "Yes, we carry a range of smart LED products including WiFi-enabled LED strips, smart bulbs, and dimmable lighting systems compatible with Alexa and Google Home.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, bank transfers, and major credit/debit cards. For large orders, we can arrange payment plans. Please contact us for details.",
  },
  {
    question: "How can I request a product catalog?",
    answer:
      "You can request our product catalog by contacting us via WhatsApp, phone, or email. We'll send you our latest catalog with full product details and specifications.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-hero-gradient text-white py-16">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 text-sm">
            FAQ
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-teal-200 max-w-xl">
            Find answers to common questions about our products and services.
          </p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-3xl">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden hover:border-brand-primary transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <div className="shrink-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  {openIndex === index ? (
                    <ChevronUp size={16} className="text-brand-primary" />
                  ) : (
                    <ChevronDown size={16} className="text-brand-primary" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-brand-border mb-4" />
                  <p className="text-brand-text leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-teal-gradient rounded-2xl p-8 text-white text-center">
          <h3 className="font-display text-2xl font-bold mb-3">Still Have Questions?</h3>
          <p className="text-teal-200 mb-6">
            Our team is ready to help. Contact us via WhatsApp, phone, or visit our showroom.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-brand-primary font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/94779900657"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
