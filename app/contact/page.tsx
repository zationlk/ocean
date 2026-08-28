import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Showroom & Inquiry | Ocean Lighting Solutions Negombo",
  description:
    "Visit Ocean Lighting Solutions showroom at 591 Chilaw Road, Kattuwa, Negombo, Sri Lanka. Contact us via phone (0314 300 657 / 077 9 900 657) or WhatsApp for quotes and product inquiries.",
  keywords: [
    "Contact Ocean Lighting Negombo",
    "Ocean Lighting showroom address",
    "lighting shop Negombo phone number",
    "LED lights showroom Chilaw road Negombo",
    "bathware shop Negombo contact",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/contact" },
  openGraph: {
    title: "Contact Showroom & Inquiry | Ocean Lighting Solutions Negombo",
    description: "Visit our Negombo showroom or reach out for inquiries, product pricing, and expert assistance.",
    url: "https://www.oceanlighting.lk/contact",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "Ocean Lighting Showroom Negombo" }],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
