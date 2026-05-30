"use server";

import { redirect } from "next/navigation";
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
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: res.status, message: data.message || "Signup failed." };
    }
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }

  // redirect() throws internally — must be outside try/catch
  redirect("/admin/login");
}
