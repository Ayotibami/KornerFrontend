"use server";

import { redirect } from "next/navigation";

export default async function signUp(formdata: FormData) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { error: "Server configuration error. Please try again later." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/signup`, {
      method: "POST",
      body: formdata,
    });

    const data = await res.json();
    console.log("omooo", data);

    if (!res.ok) {
      return { error: data.message || "Signup failed" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Signup Error:", message);
    return { error: "Connection to server failed" };
  }

  redirect("/admin/login");
}
