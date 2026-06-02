"use server";

import type { ApiResult } from "@/types/api";

export async function requestOtp(email: string): Promise<ApiResult<void>> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { ok: false, status: 500, message: "Server configuration error. Please try again later." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: res.status, message: data.message || "Failed to send OTP." };
    }

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }
}
