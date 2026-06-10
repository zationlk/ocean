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
    default: "Ocean Lighting Solutions – Premium LED Lighting in Negombo, Sri Lanka",
    template: "%s | Ocean Lighting Solutions",
  },
  description: siteSettings.metaDescription,
  keywords: [
    "LED lighting Sri Lanka",
    "lighting solutions Negombo",
    "indoor lighting",
    "outdoor lighting",
    "electrical items",
    "interior solutions",
    "Ocean Lighting",
    "LED lights",
    "chandelier",
    "flood lights",
  ],
  authors: [{ name: "Ocean Lighting Solutions" }],
  creator: "Ocean Lighting Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oceanlighting.lk",
    siteName: "Ocean Lighting Solutions",
    title: "Ocean Lighting Solutions – Premium LED Lighting in Sri Lanka",
    description: siteSettings.metaDescription,
    images: [
      {
        url: "https://www.oceanlighting.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ocean Lighting Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ocean Lighting Solutions",
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
  themeColor: "#006060",
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
                  background: "#006060",
                  color: "#fff",
                  borderRadius: "8px",
                },
              }}
            />
          </CompareProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}