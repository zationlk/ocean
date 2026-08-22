import type { Metadata } from "next"
import "./globals.css"
import LayoutShell from "@/components/layout/LayoutShell"
import { siteSettings } from "@/lib/data"
import { WishlistProvider } from "@/context/WishlistContext"
import { CompareProvider } from "@/context/CompareContext"

export const metadata: Metadata = {
  title: {
    default: "Ocean Lighting Solutions – Premium LED Lighting & Bathware in Negombo, Sri Lanka",
    template: "%s | Ocean Lighting Solutions",
  },
  description: siteSettings.metaDescription,
  keywords: [
    "LED lighting Sri Lanka",
    "LED bulbs Negombo",
    "LED ceiling lights",
    "LED strip lighting",
    "outdoor flood lights Sri Lanka",
    "bathware Negombo",
    "toilets Sri Lanka",
    "faucets mixers",
    "shower systems",
    "bathroom mirrors",
    "vanity units Sri Lanka",
    "Ocean Lighting Solutions Negombo",
    "electrical items Sri Lanka",
  ],
  authors: [{ name: "Ocean Lighting Solutions" }],
  creator: "Ocean Lighting Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oceanlighting.lk",
    siteName: "Ocean Lighting Solutions",
    title: "Ocean Lighting Solutions – Premium LED Lighting & Bathware",
    description: siteSettings.metaDescription,
    images: [
      {
        url: "https://www.oceanlighting.lk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ocean Lighting Solutions – LED Lighting & Bathware Showroom Negombo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ocean Lighting Solutions",
    description: siteSettings.metaDescription,
    images: ["https://www.oceanlighting.lk/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.oceanlighting.lk" },
  icons: { icon: "/favicon.ico" },
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
            <LayoutShell>
              {children}
            </LayoutShell>
          </CompareProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}
