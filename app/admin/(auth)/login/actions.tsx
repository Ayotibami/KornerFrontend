"use server";

import { cookies } from "next/headers";
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
      maxAge: 900,
      path: "/",
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800,
      path: "/",
    });

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, status: 503, message: "Could not connect to server. Check your connection." };
  }
}
