import { Metadata } from "next";
import { notFound } from "next/navigation";
import { query } from "@/lib/mysql";
import { Product } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function normaliseProduct(p: any): Product {
  return {
    ...p,
    modelNumber: p.model_number,
    images: p.images ? JSON.parse(p.images) : [],
    specifications: p.specifications ? JSON.parse(p.specifications) : {},
    features: p.features ? JSON.parse(p.features) : [],
    isFeatured: !!p.is_featured,
    isNew: !!p.is_new,
    shortDescription: p.short_description,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

async function fetchAllProducts(): Promise<Product[]> {
  const rows = await query("SELECT * FROM products ORDER BY created_at DESC") as any[];
  return rows.map(normaliseProduct);
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const rows = await query("SELECT * FROM products WHERE slug = ? LIMIT 1", [slug]) as any[];
  if (rows.length === 0) return null;
  return normaliseProduct(rows[0]);
}

export async function generateStaticParams() {
  try {
    const products = await fetchAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };

    const title = `${product.name} | Ocean Lighting Solutions Negombo`;
    const description = product.shortDescription || product.description || `Buy ${product.name} at Ocean Lighting Solutions, Negombo, Sri Lanka. High quality LED lighting and premium bathware.`;
    const image = product.images && product.images.length > 0 ? product.images[0] : "https://www.oceanlighting.lk/og-image.jpg";

    return {
      title,
      description,
      keywords: [
        product.name,
        `${product.category} Sri Lanka`,
        `${product.name} Negombo`,
        "LED lighting Negombo",
        "Ocean Lighting Solutions",
      ],
      alternates: { canonical: `https://www.oceanlighting.lk/products/${product.slug}` },
      openGraph: {
        title,
        description,
        url: `https://www.oceanlighting.lk/products/${product.slug}`,
        siteName: "Ocean Lighting Solutions",
        images: [{ url: image, alt: product.name }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: Product | null = null;
  let dbAvailable = true;

  try {
    product = await fetchProductBySlug(slug);
  } catch {
    dbAvailable = false;
  }

  if (!product && dbAvailable) notFound();

  let related: Product[] = [];
  if (product) {
    try {
      const allRows = await query(
        "SELECT * FROM products WHERE category = ? AND id != ? ORDER BY created_at DESC LIMIT 4",
        [product.category, product.id]
      ) as any[];
      related = allRows.map(normaliseProduct);
    } catch {
      related = [];
    }
  }

  const loadingJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Product unavailable",
    description: "Database connection pending.",
  };

  const productJsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: product.description || product.shortDescription,
    sku: product.modelNumber || product.id,
    brand: {
      "@type": "Brand",
      name: "Ocean Lighting",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "LKR",
      price: "Inquire for price",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Ocean Lighting Solutions",
      },
    },
  } : loadingJsonLd;

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center py-24 px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl border-2 border-gold/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gold animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM9 22h6a2 2 0 002-2v-1H7v1a2 2 0 002 2Zm8.29-13.29l-5-5A1 1 0 0011.584 4H8a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V8a1 1 0 00-.293-.707Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading Product...</h1>
          <p className="text-white/60">
            Database connection is not available. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
