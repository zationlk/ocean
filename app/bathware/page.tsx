import { Metadata } from "next";
import { Suspense } from "react";
import BathwareClient from "./BathwareClient";

export const metadata: Metadata = {
  title: "Bathware & Plumbing",
  description:
    "Browse our complete range of premium bathware — toilets, wash basins, faucets, showers, bathroom mirrors, vanity units, kitchen sinks and plumbing accessories.",
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
