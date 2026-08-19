import { Metadata } from "next";
import { Suspense } from "react";
import LightingClient from "./LightingClient";

export const metadata: Metadata = {
  title: "Lighting & Electrical",
  description:
    "Browse our complete range of LED lighting — indoor, outdoor, commercial, bulbs, tubes, ceiling lights, strip lighting, mirror lights, step lights and electrical items.",
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
