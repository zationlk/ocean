import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export function getCallLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function getEmailLink(email: string, subject?: string): string {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

export function formatCategoryName(slug: string): string {
  if (!slug) return "";
  const map: Record<string, string> = {
    "lighting": "Lighting & Electrical",
    "bathware": "Bathware & Sanitaryware",
    "indoor-lighting": "Indoor Lighting",
    "outdoor-lighting": "Outdoor Lighting",
    "commercial-lighting": "Commercial Lighting",
    "led-bulbs": "LED Bulbs",
    "led-tube-lights": "LED Tube Lights",
    "led-ceiling-lights": "LED Ceiling Lights",
    "led-strip-lighting": "LED Strip Lighting",
    "led-mirror-lights": "LED Mirror Lights",
    "led-step-lights": "LED Step Lights",
    "electrical-items": "Electrical Items",
    "toilets-wc": "Toilets (WC)",
    "wash-basins": "Wash Basins",
    "faucets-mixers": "Faucets & Mixers",
    "showers": "Showers",
    "bathroom-accessories": "Bathroom Accessories",
    "bathroom-mirrors": "Bathroom Mirrors",
    "vanity-units": "Vanity Units",
    "kitchen-sinks-faucets": "Kitchen Sinks & Faucets",
    "plumbing-accessories": "Plumbing Accessories",
  };
  return map[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function buildProductWhatsAppMessage(product: {
  id?: string | number;
  name: string;
  slug: string;
  category?: string;
  subcategory?: string;
}): string {
  const isBathware = product.category === "bathware" || [
    "toilets-wc", "wash-basins", "faucets-mixers", "showers",
    "bathroom-accessories", "bathroom-mirrors", "vanity-units",
    "kitchen-sinks-faucets", "plumbing-accessories"
  ].includes(product.subcategory || product.category || "");

  const mainCat = isBathware ? "Bathware & Sanitaryware" : "Lighting & Electrical";
  const subCat = product.subcategory ? formatCategoryName(product.subcategory) : formatCategoryName(product.category || "");
  const modelId = product.id ? `#${product.id}` : `#${product.slug}`;
  const productUrl = `https://www.oceanlighting.lk/products/${product.slug}`;

  return `Hello Ocean Lighting Solutions,

I would like to inquire about the following product:

📌 Product Name: ${product.name}
🆔 Model / ID: ${modelId}
📂 Main Category: ${mainCat}
🏷️ Subcategory: ${subCat}
🔗 Website Link: ${productUrl}

Please provide price details, stock availability, and delivery options. Thank you!`;
}
