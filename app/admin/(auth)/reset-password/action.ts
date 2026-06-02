"use server";

import type { ApiResult } from "@/types/api";

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<ApiResult<void>> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { ok: false, status: 500, message: "Server configuration error. Please try again later." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: res.status, message: data.message || "Password reset failed." };
    }

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }
}
