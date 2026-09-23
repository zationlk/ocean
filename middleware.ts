import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ── 1. Admin Page Protection ──────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already authenticated, redirect from login to dashboard
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      const session = await verifySessionToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Protect all other /admin routes
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid session cookie if present
      if (token) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }

    return NextResponse.next();
  }

  // ── 2. API Route Protection ───────────────────────────────────────────
  if (pathname.startsWith("/api")) {
    // Auth routes are public (login, logout, me handles its own 401)
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Public contact form submission
    if (pathname === "/api/inquiries" && method === "POST") {
      return NextResponse.next();
    }

    // Customer inquiries list is PRIVATE (contains emails, phones, messages)
    const isPrivateInquiriesRead = pathname.startsWith("/api/inquiries") && method === "GET";

    // All data modifications (POST, PUT, DELETE, PATCH) on site content are restricted to admin
    const isMutatingContent = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

    if (isPrivateInquiriesRead || isMutatingContent) {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      const session = await verifySessionToken(token);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized: Admin session required" },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
