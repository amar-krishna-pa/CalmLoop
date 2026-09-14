import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/lib/auth/auth";

const publicAssets = new Set([
  "/window.svg",
  "/globe.svg",
  "/vercel.svg",
  "/next.svg",
  "/file.svg",
]);

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicAssets.has(path)) return NextResponse.next();

  const isAuthRoute = path === "/login" || path === "/signup";
  const isRootRoute = path === "/";
  // New and renamed pages require a session unless explicitly made public here.
  const isProtectedRoute = !isAuthRoute && !isRootRoute;

  // Check if session cookie exists before making a DB call
  const cookiesList = request.cookies.getAll();
  const hasSessionToken = cookiesList.some((c) =>
    c.name.includes("better-auth.session_token"),
  );

  let session = null;
  if (hasSessionToken) {
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (e) {
      console.error("Failed to fetch session in proxy:", e);
    }
  }

  // Redirect logic
  if (isProtectedRoute && !session) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((isAuthRoute || isRootRoute) && session) {
    return NextResponse.redirect(new URL("/today", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match pages; API routes enforce their own authentication and ownership.
     * Exclude:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api(?:/|$)|_next/|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)",
  ],
};
