import { NextResponse } from "next/server";
import { resolveExternalImageUrl } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const resolvedUrl = await resolveExternalImageUrl(rawUrl);
    return NextResponse.json({
      success: true,
      originalUrl: rawUrl,
      resolvedUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to resolve image URL" },
      { status: 500 }
    );
  }
}
