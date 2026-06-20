import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PRIVATE_PATTERN = /^\/(en|bn)\/profile(\/|$)/;
const AUTH_PATTERN =
  /^\/(en|bn)\/(login|register|forgot-password|reset-password|otp-verification)(\/|$)/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  if (PRIVATE_PATTERN.test(pathname) && !token) {
    const locale = pathname.startsWith("/bn") ? "bn" : "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_PATTERN.test(pathname) && token) {
    const locale = pathname.startsWith("/bn") ? "bn" : "en";
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all paths except Next.js internals, API routes, and static files.
  // Note: proxy.ts was called middleware.ts up until Next.js 16.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
