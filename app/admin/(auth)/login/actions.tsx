"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login(formdata: FormData) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { error: "Server error. Please try again later." };
  }

  const email = formdata.get("email");
  const password = formdata.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Login failed" };
    }

    const token = data.data?.token;

    if (!token) {
      return { error: "No token received from server" };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
      path: "/",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Login Error:", message);
    return { error: "Connection to server failed" };
  }

  redirect("/admin/home");
}
