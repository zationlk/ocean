import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import CompareBar from "@/components/ui/CompareBar"
import BackToTop from "@/components/ui/BackToTop"
import { Toaster } from "react-hot-toast"
import { siteSettings } from "@/lib/data"
import { WishlistProvider } from "@/context/WishlistContext"
import { CompareProvider } from "@/context/CompareContext"

export const metadata: Metadata = {
  title: {
    default: "OCEAN Lighting Solutions – Premium LED Lighting & OCEANA Luxury Bathware",
    template: "%s | OCEAN Lighting Solutions",
  },
  description: siteSettings.metaDescription,
  keywords: [
    "LED lighting Sri Lanka",
    "bathware Negombo",
    "luxury sanitaryware",
    "designer showers Sri Lanka",
    "indoor lighting Negombo",
    "outdoor lighting Sri Lanka",
    "OCEAN Lighting Solutions Negombo",
    "OCEANA Bathware",
    "LED lights",
    "freestanding bathtubs",
    "smart toilet",
  ],
  authors: [{ name: "OCEAN Lighting Solutions" }],
  creator: "OCEAN Lighting Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oceanlighting.lk",
    siteName: "OCEAN Lighting Solutions",
    title: "OCEAN Lighting Solutions – Premium LED Lighting & OCEANA Luxury Bathware",
    description: siteSettings.metaDescription,
    images: [
      {
        url: "https://www.oceanlighting.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OCEAN Lighting Solutions & OCEANA Bathware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OCEAN Lighting Solutions",
    description: siteSettings.metaDescription,
    images: ["https://www.oceanlighting.lk/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.oceanlighting.lk",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <WishlistProvider>
          <CompareProvider>
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
          </CompareProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}