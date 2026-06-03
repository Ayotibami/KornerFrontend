import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_URL ?? "";

// Runs before every request matched by the config below.
//
// Flow:
//   1. auth_token cookie present → let through (token still valid)
//   2. auth_token missing, refresh_token present → call POST /admin/refresh
//        success → set new auth_token cookie, let through
//        failure → redirect to login
//   3. neither cookie → redirect to login
//
// The matcher excludes /admin/login and /admin/signup so this never
// runs on the auth pages and there's no redirect loop.

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const res = await fetch(`${BASE_URL}/admin/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const newAccessToken = data.data?.accessToken;

        if (newAccessToken) {
          const response = NextResponse.next();
          response.cookies.set("auth_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 900,
            path: "/",
          });
          return response;
        }
      }
    } catch {
      // Network error — fall through to redirect
    }
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Runs on all /admin routes except the unauthenticated auth pages
  matcher: ["/admin/((?!login|signup|forgot-password|reset-password).*)"],
};
