"use server";

import { validatePassword } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Login = async (formdata: FormData) => {
  const email = formdata.get("email");
  const password = formdata.get("password") as string; // Cast to string for validator

  // 1. Basic Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    return { error: passwordCheck.message };
  }

  let success = false;

  try {
    const res = await fetch("http://127.0.0.1:3000/api/v1/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    const setCookieHeader = res.headers.get("set-cookie");

    if (setCookieHeader) {
      const firstPart = setCookieHeader.split(";")[0];

      // 2. Split by the "=" to get just the "eyJhbG..."
      const tokenValue = firstPart.split("=")[1];
      const cookieStore = await cookies();
      cookieStore.set("auth_token", tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400, // Matching your Express setting
        path: "/",
      });
    }

    if (!res.ok) {
      return { error: data.message || "Login failed" };
    }

    const token = data.data?.token;

    if (token) {
      success = true;
    } else {
      return { error: "No token received from server" };
    }
  } catch (error: any) {
    console.error("Login Error:", error.message);
    return { error: "Connection to server failed" };
  }

  // 3. Redirect must happen OUTSIDE the try/catch block
  if (success) {
    redirect("/admin/home");
  }
};

export default Login;
