/**
 * Image normalization and proxy helpers for Ocean Lighting Solutions.
 * Automatically handles:
 * - Google Drive share links (view?usp=sharing, open?id=..., /d/FILE_ID)
 * - Pinterest pin links (pinterest.com/pin/..., pin.it/...)
 * - Pinterest direct CDN links (i.pinimg.com)
 * - Dropbox links (dl=0 -> raw=1)
 * - Imgur links
 * - External image hotlinking protection bypass via referrerPolicy="no-referrer" & /api/image-proxy
 */

/**
 * Synchronously normalizes known URL patterns into direct image URLs.
 */
export function normalizeImageUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== "string") return "/placeholder-product.jpg";
  let url = rawUrl.trim();
  if (!url) return "/placeholder-product.jpg";

  // If it's a relative path or data URL, leave as-is
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // 1. Google Drive URLs
  // Patterns:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  // - https://docs.google.com/...
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = (dMatch && dMatch[1]) || (idMatch && idMatch[1]);
    if (fileId) {
      // High-resolution Google Drive direct thumbnail
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  // 2. Pinterest direct images: upgrade thumbnail resolutions to high quality
  if (url.includes("i.pinimg.com")) {
    // If it's 236x or 474x, upgrade to 736x for crisp display
    url = url.replace(/\/236x\//g, "/736x/").replace(/\/474x\//g, "/736x/");
    return url;
  }

  // 3. Dropbox links: replace dl=0 / dl=1 with raw=1 for direct binary stream
  if (url.includes("dropbox.com")) {
    const clean = url.replace(/[?&]dl=[01]/g, "");
    return clean + (clean.includes("?") ? "&raw=1" : "?raw=1");
  }

  // 4. Imgur links: append .jpg if direct image ID without extension
  if (url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)$/)) {
    const match = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)$/);
    if (match && match[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
  }

  // 5. Pinterest pin webpages (not direct CDN): automatically route through image-proxy
  if (url.includes("pinterest.com/pin/") || url.includes("pin.it/")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/**
 * Returns a normalized product image URL, falling back to placeholder if empty.
 */
export function getProductImage(url?: string | null): string {
  if (!url || typeof url !== "string") return "/placeholder-product.jpg";
  const normalized = normalizeImageUrl(url);
  return normalized || "/placeholder-product.jpg";
}

/**
 * Universal React image error fallback handler.
 * If an external image fails to load (due to CORS, hotlink protection, or referrer policy),
 * it seamlessly attempts to load via our server-side image proxy (/api/image-proxy?url=...).
 * If the proxy also fails or the image is 404, it falls back to /placeholder-product.jpg.
 */
export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  const currentSrc = img.src;

  // Don't loop if placeholder or logo failed
  if (
    currentSrc.includes("/placeholder-product.jpg") ||
    currentSrc.includes("/logo.png") ||
    img.dataset.fallbackApplied === "final"
  ) {
    return;
  }

  // If haven't tried proxy yet, and it's an external http/https URL:
  if (
    !img.dataset.fallbackApplied &&
    currentSrc.startsWith("http") &&
    !currentSrc.includes("/api/image-proxy")
  ) {
    img.dataset.fallbackApplied = "proxy";
    img.src = `/api/image-proxy?url=${encodeURIComponent(currentSrc)}`;
    return;
  }

  // Final fallback to placeholder
  img.dataset.fallbackApplied = "final";
  img.src = "/placeholder-product.jpg";
}

/**
 * Server-side / async resolver for URLs that require network lookup,
 * such as Pinterest Pin webpages (pinterest.com/pin/... or pin.it/...).
 */
export async function resolveExternalImageUrl(rawUrl: string): Promise<string> {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let url = rawUrl.trim();
  if (!url) return "";

  // Run synchronous normalization first (handles Drive, Dropbox, Imgur, direct Pinterest)
  url = normalizeImageUrl(url);

  // If it's a Pinterest webpage / pin link or shortlink:
  if (url.includes("pinterest.com/pin/") || url.includes("pin.it/")) {
    try {
      let targetUrl = url;
      // Follow shortlink if needed
      if (url.includes("pin.it/")) {
        const headRes = await fetch(url, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        targetUrl = headRes.url;
      }

      // Query Pinterest's official public oEmbed API
      const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(targetUrl)}`;
      const oembedRes = await fetch(oembedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.thumbnail_url) {
          // Upgrade thumbnail to high resolution 736x or 1200x
          return data.thumbnail_url.replace(/\/236x\//g, "/736x/");
        }
      }
    } catch (err) {
      console.error("Failed to resolve Pinterest URL:", err);
    }
  }

  return url;
}
