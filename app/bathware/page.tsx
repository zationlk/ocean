import { Metadata } from "next";
import { Suspense } from "react";
import BathwareClient from "./BathwareClient";

export const metadata: Metadata = {
  title: "Luxury Bathware & Sanitaryware Showroom Negombo | Ocean Lighting",
  description:
    "Explore luxury bathware in Negombo — water closets, wash basins, thermostatic showers, mixer taps, LED bathroom mirrors, vanity cabinets, and kitchen sinks in Sri Lanka.",
  keywords: [
    "bathware Negombo",
    "luxury sanitaryware Sri Lanka",
    "water closet toilet Negombo",
    "wash basin Sri Lanka",
    "bathroom faucets mixers Negombo",
    "rain shower systems Sri Lanka",
    "LED bathroom mirrors Negombo",
    "vanity units Sri Lanka",
  ],
  alternates: { canonical: "https://www.oceanlighting.lk/bathware" },
  openGraph: {
    title: "Luxury Bathware & Sanitaryware Showroom Negombo | Ocean Lighting",
    description: "Discover luxury toilets, basins, showers, faucets, and vanity units at Ocean Lighting & Bathware Showroom in Negombo.",
    url: "https://www.oceanlighting.lk/bathware",
    siteName: "Ocean Lighting Solutions",
    images: [{ url: "https://www.oceanlighting.lk/og-image.jpg", alt: "Luxury Bathware Showroom Negombo" }],
  },
};

export default function BathwarePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BathwareClient />
    </Suspense>
  );
}
