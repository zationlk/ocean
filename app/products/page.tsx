import { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our complete range of LED lighting, indoor lighting, outdoor lighting, electrical items, and interior solutions.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsClient />
    </Suspense>
  );
}
