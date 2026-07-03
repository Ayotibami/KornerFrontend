"use server";

const BASE_URL = process.env.API_URL ?? "";

type SubscribeResult =
  | { ok: true }
  | { ok: false; alreadySubscribed: boolean; message: string };

export async function subscribeToNewsletter(
  name: string,
  email: string
): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${BASE_URL}/user/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim() }),
    });

    const data = await res.json();

    if (res.status === 400) {
      return { ok: false, alreadySubscribed: true, message: data.message };
    }

    if (!res.ok) {
      return {
        ok: false,
        alreadySubscribed: false,
        message: data.message ?? "Something went wrong — please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      alreadySubscribed: false,
      message: "Network error — check your connection and try again.",
    };
  }
}
