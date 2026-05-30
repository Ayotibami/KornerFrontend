import { NextRequest, NextResponse } from "next/server";

// /admin routes that don't require a session token.
// Every other /admin/* path needs auth_token — unauthenticated requests are redirected to login.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/signUp"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Non-admin routes are public — skip all checks.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login and signup are always accessible — they are the unauthenticated entry points.
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  // No token = not logged in. Redirect to login.
  // The AuthLayout (/admin/(auth)/layout.tsx) handles the reverse:
  // redirecting already-logged-in users away from the auth pages.
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on every route except Next.js internal paths and static files.
  // Without this matcher, the middleware would intercept _next/static requests
  // and break asset loading.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
