import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL ?? "";

// Thrown when the server returns a non-2xx response.
// Carries the HTTP status so callers can distinguish 401 (unauthorized) from 500 (server error).
//
// How callers handle it:
//   Server components  — let it propagate; the nearest error.tsx catches and renders it.
//   Server actions     — catch it and return ApiResult<void> with ok: false.
export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

// Central authenticated fetch function.
// Reads the auth_token httpOnly cookie set during login and attaches it as a
// Bearer Authorization header on every outgoing request to the backend.
//
// IMPORTANT: This file has NO "use server" directive intentionally.
// "use server" is ONLY for Server Action files (functions callable from client components).
// This is a plain server-side utility — it runs server-side because it imports
// from "next/headers", which is unavailable in the browser. No directive needed.
export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers, // allow callers to override individual headers
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(
      body?.message ?? `Request failed (${res.status})`,
      res.status
    );
  }

  return res;
}
