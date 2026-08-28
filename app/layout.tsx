import type { Metadata } from "next"
import "./globals.css"
import LayoutShell from "@/components/layout/LayoutShell"
import { WishlistProvider } from "@/context/WishlistContext"
import { CompareProvider } from "@/context/CompareContext"
import { SiteSettings } from "@/lib/types"
import { unstable_cache } from "next/cache"
import { query } from "@/lib/mysql"


const DEFAULT_COMPANY_NAME = "Ocean Lighting Solutions"
const DEFAULT_META_DESCRIPTION = "Ocean Lighting Solutions – Premium LED lighting, electrical items, and luxury bathware in Negombo, Sri Lanka. Visit our showroom at 591, Chilaw Road, Kattuwa."

const DEFAULT_SETTINGS_OBJ: SiteSettings = {
  companyName: DEFAULT_COMPANY_NAME,
  tagline: "Premium Lighting & Bathware — Negombo, Sri Lanka",
  address: "591, Chilaw Road, Kattuwa, Negombo, Sri Lanka",
  email: "oceanlighting303@gmail.com",
  website: "www.oceanlighting.lk",
  telephone: "0314 300 657",
  mobile: "077 9 900 657",
  whatsapp: "94779900657",
  businessHours: {
    weekdays: "Monday – Friday: 8:00 AM – 6:00 PM",
    saturday: "Saturday: 8:00 AM – 4:00 PM",
    sunday: "Sunday: Closed",
  },
  heroTitle: "Illuminate & Elevate Your Spaces",
  heroSubtitle: "Sri Lanka's trusted destination for premium LED lighting, electrical items, and luxury bathware.",
  aboutText: "",
  metaDescription: DEFAULT_META_DESCRIPTION,
}

// Server-side cache: reads DB directly, cached for 60 s with Next.js unstable_cache
const fetchSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const rows = await query("SELECT `key`, `value` FROM site_settings") as any[]
      const map: Record<string, any> = { ...DEFAULT_SETTINGS_OBJ }
      for (const row of rows) {
        try { map[row.key] = JSON.parse(row.value) } catch { map[row.key] = row.value }
      }
      return map as SiteSettings
    } catch (err) {
      console.error("Error fetching settings:", err)
      return DEFAULT_SETTINGS_OBJ
    }
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
)


export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings()
  const companyName = settings.companyName || DEFAULT_COMPANY_NAME
  const metaDescription = settings.metaDescription || DEFAULT_META_DESCRIPTION

  return {
    metadataBase: new URL("https://www.oceanlighting.lk"),
    title: {
      default: `${companyName} | Premium LED Lighting & Bathware Showroom Negombo, Sri Lanka`,
      template: `%s | ${companyName}`,
    },
    description: metaDescription,
    keywords: [
      "LED lighting Sri Lanka",
      "LED bulbs Negombo",
      "LED panel lights",
      "LED chandelier Negombo",
      "LED flood lights Sri Lanka",
      "bathware showroom Negombo",
      "luxury sanitaryware Sri Lanka",
      "toilets & wash basins Negombo",
      "bathroom faucets & showers",
      "electrical appliances Sri Lanka",
      "Ocean Lighting Solutions Negombo",
      "architectural lighting Negombo",
      "commercial LED lights Sri Lanka",
    ],
    authors: [{ name: companyName, url: "https://www.oceanlighting.lk" }],
    creator: companyName,
    publisher: companyName,
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://www.oceanlighting.lk",
      siteName: companyName,
      title: `${companyName} – Premium LED Lighting & Bathware Showroom`,
      description: metaDescription,
      images: [
        {
          url: "https://www.oceanlighting.lk/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${companyName} – Premium LED Lighting & Luxury Bathware in Negombo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyName} – LED Lighting & Bathware`,
      description: metaDescription,
      images: ["https://www.oceanlighting.lk/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: { canonical: "https://www.oceanlighting.lk" },
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await fetchSettings()
  const companyName = settings.companyName || DEFAULT_COMPANY_NAME

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": "https://www.oceanlighting.lk/#store",
    name: companyName,
    description: settings.metaDescription || DEFAULT_META_DESCRIPTION,
    url: "https://www.oceanlighting.lk",
    telephone: settings.telephone || "0314 300 657",
    email: settings.email || "oceanlighting303@gmail.com",
    priceRange: "$$",
    currenciesAccepted: "LKR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "591, Chilaw Road, Kattuwa",
      addressLocality: "Negombo",
      addressRegion: "Western Province",
      postalCode: "11500",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.2341,
      longitude: 79.8402,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      settings.socialMedia?.facebook || "https://facebook.com/oceanlighting",
      settings.socialMedia?.instagram || "https://instagram.com/oceanlighting",
    ].filter(Boolean),
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
