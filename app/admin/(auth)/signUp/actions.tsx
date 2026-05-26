"use server";

import { redirect } from "next/navigation";

const signUp = async (formdata: FormData) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return { error: "Server configuration error. Please try again later." };
  }

  try {
    const res = await fetch(`${apiUrl}/admin/signup`, {
      method: "POST",
      body: formdata,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Signup failed" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Signup Error:", message);
    return { error: "Connection to server failed" };
  }

  redirect("/admin/login");
};

export default signUp;
