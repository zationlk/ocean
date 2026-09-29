import { NextResponse } from "next/server";
import { resolveExternalImageUrl, normalizeImageUrl } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // 1. Resolve / normalize URL
    let targetUrl = normalizeImageUrl(rawUrl);
    if (targetUrl.includes("pinterest.com/pin/") || targetUrl.includes("pin.it/")) {
      targetUrl = await resolveExternalImageUrl(targetUrl);
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return new NextResponse("Invalid URL scheme", { status: 400 });
    }

    // 2. Fetch the image server-side (bypasses browser CORS & hotlink restrictions)
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!upstreamRes.ok) {
      // If Google Drive thumbnail failed, try alternative lh3 endpoint
      if (rawUrl.includes("drive.google.com") || rawUrl.includes("docs.google.com")) {
        const dMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        const idMatch = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const fileId = (dMatch && dMatch[1]) || (idMatch && idMatch[1]);
        if (fileId) {
          const lh3Res = await fetch(`https://lh3.googleusercontent.com/d/${fileId}`, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });
          if (lh3Res.ok) {
            const contentType = lh3Res.headers.get("content-type") || "image/jpeg";
            const buffer = await lh3Res.arrayBuffer();
            return new NextResponse(buffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
        }
      }

      return NextResponse.redirect(new URL("/placeholder-product.jpg", request.url));
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";

    // If upstream returned HTML instead of an image (e.g. login or preview page), fallback to placeholder
    if (contentType.includes("text/html")) {
      return NextResponse.redirect(new URL("/placeholder-product.jpg", request.url));
    }

    const imageBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error for URL:", rawUrl, error);
    return NextResponse.redirect(new URL("/placeholder-product.jpg", request.url));
  }
}
