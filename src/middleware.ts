// app/middleware.ts
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import {
  getRateLimit,
  getRateLimitHeaders,
  getAllowedOrigin,
  getCorsHeaders,
} from "@/lib/middleware-utils";

const STATIC_ALLOW = [
  "/_next/",
  "/assets/",
  "/robots.txt",
  "/sitemap",
  "/site.webmanifest",
];
const PUBLIC_ROUTES = ["/", "/login", "/api/auth", "/api/contact"];

function isStaticPath(pathname: string) {
  return STATIC_ALLOW.some((p) => pathname.startsWith(p));
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p));
}

function getClientIp(request: NextRequestWithAuth): string {
  const fwd = request.headers.get("x-forwarded-for") || "";
  const real = request.headers.get("x-real-ip") || "";
  return fwd.split(",")[0].trim() || real || "unknown";
}

async function customMiddleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl;

  // Skip static and public routes
  if (isStaticPath(pathname) || isPublicRoute(pathname))
    return NextResponse.next();

  // Handle /api routes
  if (pathname.startsWith("/api/")) {
    // Special logic for /api/contact
    if (pathname.startsWith("/api/contact")) {
      const allowedOrigin = getAllowedOrigin(request);
      if (!allowedOrigin)
        return NextResponse.json(
          { error: "origin_not_allowed" },
          { status: 403 }
        );

      const corsHeaders = getCorsHeaders(allowedOrigin);

      if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers: corsHeaders });
      }

      if (request.method !== "POST") {
        return NextResponse.json(
          { error: "method_not_allowed" },
          { status: 405, headers: corsHeaders }
        );
      }

      const ip = getClientIp(request);
      const rateLimit = getRateLimit(ip, pathname);
      const rateLimitHeaders = getRateLimitHeaders(rateLimit);
      rateLimitHeaders.forEach((value, key) => corsHeaders.set(key, value));

      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: rateLimit.config.message },
          { status: 429, headers: corsHeaders }
        );
      }

      const response = NextResponse.next();
      corsHeaders.forEach((value, key) => response.headers.set(key, value));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // Generic API rate limiting
    const ip = getClientIp(request);
    const rateLimit = getRateLimit(ip, pathname);
    const headers = getRateLimitHeaders(rateLimit);
    headers.set("Cache-Control", "no-store");

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.config.message },
        { status: 429, headers }
      );
    }

    const response = NextResponse.next();
    headers.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  const token = request.nextauth.token;
  if (token) {
    if (token.role === "user" && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (token.role === "candidate") {
      if (
        token.status === "pending" &&
        pathname.startsWith("/candidate/dashboard")
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/candidate/onboarding";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const middleware = withAuth(customMiddleware, {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*", "/api/:path*"],
};
