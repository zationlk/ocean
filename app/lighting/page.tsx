import { Metadata } from "next";
import { Suspense } from "react";
import LightingClient from "./LightingClient";

export const metadata: Metadata = {
  title: "LED Lighting & Electrical Items Showroom Negombo | Ocean Lighting",
  description:
    "Explore Sri Lanka's premium LED lighting collection — indoor, outdoor, commercial, LED bulbs, panel lights, strip lights, track lights, floodlights, and electrical items in Negombo.",
  keywords: [
    "LED lighting Sri Lanka",
    "LED bulbs Negombo",
    "indoor LED lighting Negombo",
    "outdoor floodlights Sri Lanka",
    "commercial lighting Negombo",
    "ceiling lights Sri Lanka",
    "LED strip lighting Negombo",
    "electrical accessories Sri Lanka",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/lighting" },
  openGraph: {
    title: "LED Lighting & Electrical Items Showroom Negombo | Ocean Lighting",
    description: "Browse premium indoor, outdoor, commercial LED lighting and electrical supplies at Ocean Lighting Solutions, Negombo.",
    url: "https://www.oceanlighting.lk/lighting",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "LED Lighting Showroom Negombo" }],
  },
};

export default function LightingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LightingClient />
    </Suspense>
  );
}
