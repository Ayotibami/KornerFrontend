"use server";

// Server action called by LogoutButton in the Navbar.
//
// Flow:
//   1. Read the refresh_token cookie and notify the backend so it can invalidate
//      the token server-side (prevents reuse even if someone has the raw token value).
//      Uses plain fetch — NOT apiRequest — because logout does not require a valid
//      access token, and we don't want a failing refresh to block the logout.
//   2. Delete both httpOnly cookies (auth_token + refresh_token).
//   3. Redirect to login.
//
// The backend call is fire-and-forget style: if it fails we still clear cookies
// and redirect — a failed API call should never trap the user in the panel.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.API_URL ?? "";

export async function logout() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    try {
      await fetch(`${BASE_URL}/admin/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore network errors — cookies are cleared regardless
    }
  }

  cookieStore.delete("auth_token");
  cookieStore.delete("refresh_token");
  redirect("/admin/login");
}
