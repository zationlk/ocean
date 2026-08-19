interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ocean Lighting Solutions",
    description:
      "Sri Lanka's trusted destination for premium LED lighting, electrical items, and bathware. Showroom at 591, Chilaw Road, Kattuwa, Negombo.",
    url: "https://www.oceanlighting.lk",
    logo: "https://www.oceanlighting.lk/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "591, Chilaw Road, Kattuwa",
      addressLocality: "Negombo",
      addressRegion: "Western Province",
      addressCountry: "LK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+94314300657",
      contactType: "customer service",
      availableLanguage: ["English", "Sinhala", "Tamil"],
    },
    sameAs: [
      "https://facebook.com/oceanlighting",
      "https://instagram.com/oceanlighting",
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: "Ocean Lighting Solutions",
    image: "https://www.oceanlighting.lk/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "591, Chilaw Road, Kattuwa",
      addressLocality: "Negombo",
      addressRegion: "Western Province",
      postalCode: "11500",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "7.2104848",
      longitude: "79.8384555",
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
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
      },
    ],
    priceRange: "$$",
  };
}

export function generateProductSchema(
  products: Array<{
    name: string;
    description: string;
    images: string[];
    price?: string;
    brand?: string;
    sku?: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        brand: product.brand
          ? { "@type": "Brand", name: product.brand }
          : undefined,
        sku: product.sku,
        offers: product.price
          ? {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "LKR",
              availability: "https://schema.org/InStock",
            }
          : undefined,
      },
    })),
  };
}
