import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/lib/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define route rules
  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/profile");
  const isAuthRoute = path === "/login" || path === "/signup";
  const isRootRoute = path === "/";

  // Check if session cookie exists before making a DB call
  const cookiesList = request.cookies.getAll();
  const hasSessionToken = cookiesList.some((c) =>
    c.name.includes("better-auth.session_token")
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
    // Redirect authenticated users to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
