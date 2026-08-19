import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ocean Lighting Solutions. Visit our showroom at 591, Chilaw Road, Kattuwa, Negombo or contact us via phone, email, or WhatsApp.",
};

export default function ContactPage() {
  return <ContactClient />;
}
