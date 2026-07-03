"use server";

const BASE_URL = process.env.API_URL ?? "";

type Result = { ok: true } | { ok: false; message: string };

export async function unsubscribeEmail(email: string): Promise<Result> {
  try {
    const res = await fetch(`${BASE_URL}/user/unsubscribe`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, message: data.message ?? "Something went wrong — please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Network error — check your connection and try again." };
  }
}
