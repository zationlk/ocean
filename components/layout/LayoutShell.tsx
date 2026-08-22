"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CompareBar from "@/components/ui/CompareBar";
import BackToTop from "@/components/ui/BackToTop";
import { Toaster } from "react-hot-toast";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin routes: no site Navbar/Footer/WhatsApp/Toaster
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <CompareBar />
      <BackToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#D4AF37",
            color: "#0F0F11",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "13px",
            border: "1px solid rgba(15,15,17,0.1)",
          },
        }}
      />
    </>
  );
}
