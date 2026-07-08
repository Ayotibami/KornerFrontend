"use server";

// Signup server action — creates a new admin account.
// On success, redirects to the login page so the new admin logs in with their credentials.
// Does NOT log them in automatically (no cookie set here) — that's a deliberate choice
// so the admin confirms their credentials work before entering the panel.
//
// Why redirect() is outside try/catch: see login/actions.tsx for the full explanation.

import type { ApiResult } from "@/types/api";

export default async function signUp(formData: FormData): Promise<ApiResult<void>> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { ok: false, status: 500, message: "Server configuration error. Please try again later." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        avatar_url: formData.get("avatar_url"),
        avatar_public_id: formData.get("avatar_public_id") || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: res.status, message: data.message || "Signup failed." };
    }
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }

  return { ok: true, data: undefined };
}
