import { Metadata } from "next";
import { notFound } from "next/navigation";
import { query } from "@/lib/mysql";
import { Product } from "@/lib/types";
import { safeParseJson } from "@/lib/utils";
import { normalizeImageUrl } from "@/lib/image-utils";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { slug: string } | Promise<{ slug: string }>;
}

function normaliseProduct(p: any): Product {
  const rawImages = safeParseJson<any>(p.images, []);
  let imagesArray: string[] = [];
  if (Array.isArray(rawImages)) {
    imagesArray = rawImages.filter(Boolean).map(normalizeImageUrl);
  } else if (typeof rawImages === "string" && rawImages.trim()) {
    imagesArray = [normalizeImageUrl(rawImages.trim())];
  }
  if (imagesArray.length === 0) {
    imagesArray = ["/placeholder-product.jpg"];
  }

  const rawSpecs = safeParseJson<any>(p.specifications, {});
  const specifications = (rawSpecs && typeof rawSpecs === "object" && !Array.isArray(rawSpecs)) ? rawSpecs : {};

  const rawFeatures = safeParseJson<any>(p.features, []);
  const features = Array.isArray(rawFeatures) ? rawFeatures.filter(Boolean) : [];

  return {
    ...p,
    modelNumber: p.model_number || p.modelNumber || "",
    images: imagesArray,
    specifications,
    features,
    isFeatured: !!(p.is_featured || p.isFeatured),
    isNew: !!(p.is_new || p.isNew),
    shortDescription: p.short_description || p.shortDescription || "",
    description: p.description || "",
    createdAt: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
  };
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await query("SELECT * FROM products WHERE slug = ? LIMIT 1", [slug]) as any[];
    if (!rows || rows.length === 0) return null;
    return normaliseProduct(rows[0]);
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams?.slug;
    if (!slug) return { title: "Product Not Found" };

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
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) notFound();

  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  let related: Product[] = [];
  try {
    const allRows = await query(
      "SELECT * FROM products WHERE category = ? AND id != ? ORDER BY created_at DESC LIMIT 4",
      [product.category, product.id]
    ) as any[];
    if (Array.isArray(allRows)) {
      related = allRows.map(normaliseProduct);
    }
  } catch (err) {
    console.error("Error fetching related products:", err);
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
