import { Metadata } from "next";
import { notFound } from "next/navigation";
import { query } from "@/lib/mysql";
import { Product } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";

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
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  let related: Product[] = [];
  try {
    const allRows = await query(
      "SELECT * FROM products WHERE category = ? AND id != ? ORDER BY created_at DESC LIMIT 4",
      [product.category, product.id]
    ) as any[];
    related = allRows.map(normaliseProduct);
  } catch {
    related = [];
  }

  const productJsonLd = {
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
  };

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
