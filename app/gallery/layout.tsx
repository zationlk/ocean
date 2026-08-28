import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lighting & Bathware Gallery | Ocean Lighting Solutions Negombo",
  description:
    "View our photo gallery of installed LED ceiling lights, chandeliers, outdoor floodlights, rain showers, and vanity units in Negombo, Sri Lanka.",
  keywords: [
    "LED lighting gallery Sri Lanka",
    "bathware photos Negombo",
    "chandelier gallery Negombo",
    "outdoor lights photos Sri Lanka",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/gallery" },
  openGraph: {
    title: "Lighting & Bathware Gallery | Ocean Lighting Solutions Negombo",
    description: "Browse images of our premium lighting and bathware installations across Sri Lanka.",
    url: "https://www.oceanlighting.lk/gallery",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "Ocean Lighting Photo Gallery" }],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
