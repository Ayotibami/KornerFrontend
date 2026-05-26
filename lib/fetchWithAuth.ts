"use server";

import { cookies } from "next/headers";

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Cookie: `session=${token}`,
    },
  });
}
