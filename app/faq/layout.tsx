import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Ocean Lighting Solutions Negombo",
  description:
    "Find answers to common questions about LED lighting, bathware products, delivery across Sri Lanka, showroom location in Negombo, warranty, and bulk orders.",
  keywords: [
    "Ocean Lighting FAQ",
    "LED lights warranty Sri Lanka",
    "lighting delivery Negombo",
    "lighting showroom opening hours Negombo",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/faq" },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Ocean Lighting Solutions Negombo",
    description: "Get answers to your questions regarding LED lighting, bathware, delivery, and showroom details in Negombo, Sri Lanka.",
    url: "https://www.oceanlighting.lk/faq",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "Ocean Lighting FAQ" }],
  },
};

const faqs = [
  { question: "What types of lighting products do you carry?", answer: "We carry a comprehensive range including LED panel lights, chandeliers, pendant lights, track lighting, outdoor flood lights, solar garden lights, LED strip lights, industrial high bay lights, and much more." },
  { question: "Do you offer island-wide delivery?", answer: "Yes, we deliver across Sri Lanka." },
  { question: "What warranty do your products come with?", answer: "Warranty periods range from 1 to 5 years depending on product and brand." },
  { question: "Can I visit your showroom to see products in person?", answer: "Yes! Visit our showroom at 591, Chilaw Road, Kattuwa, Negombo." },
  { question: "Do you carry smart lighting products?", answer: "Yes, we carry smart LED strips, smart bulbs, and dimmable lighting systems." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
