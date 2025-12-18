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
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Login failed" };
    }

    // 2. Setting the Cookie (Check your API response structure!)
    // If your backend sends { data: { token: "..." } } use data.data.token
    const token = data.data?.token;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      success = true; // Mark success to trigger redirect outside try/catch
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
