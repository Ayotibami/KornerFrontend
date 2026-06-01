"use server";

// Login server action — called from the login page's form submit handler.
// Does NOT use apiRequest() because it's the unauthenticated entry point:
// we don't have a token yet, and this action needs to receive the token FROM the server.
//
// Flow:
//   1. POST credentials to /admin/login
//   2. On success: extract the JWT token from the response body
//   3. Store it as an httpOnly cookie (browser JS cannot read httpOnly cookies,
//      so XSS attacks can't steal the token)
//   4. redirect() to the home page
//
// Why redirect() is outside the try/catch:
//   Next.js's redirect() works by throwing a special internal error.
//   If redirect() is inside a catch block, the catch would swallow it.
//   The pattern is: do all fallible work inside try/catch, then call redirect() after.
//
// Returns ApiResult<void> so the login page can display errors without a page reload.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiResult } from "@/types/api";

export default async function login(formData: FormData): Promise<ApiResult<void>> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { ok: false, status: 500, message: "Server configuration error. Please try again later." };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { ok: false, status: 400, message: "Email and password are required." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: res.status, message: data.message || "Login failed." };
    }

    const accessToken = data.data?.accessToken;
    const refreshToken = data.data?.refreshToken;

    if (!accessToken || !refreshToken) {
      return { ok: false, status: 500, message: "No token received from server." };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900,       // 15 minutes — matches JWT expiry so cookie disappears when token expires
      path: "/",
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800,    // 7 days
      path: "/",
    });
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }

  // redirect() must be outside try/catch — see file header comment.
  redirect("/admin/home");
}
