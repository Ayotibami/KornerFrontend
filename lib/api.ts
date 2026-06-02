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

// Shared fetch helper — builds the request with the correct auth headers.
// Extracted so the original call and the retry don't duplicate the headers logic.
function fetchWithToken(
  path: string,
  options: RequestInit,
  token: string,
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// Central authenticated fetch function.
// Reads the auth_token httpOnly cookie and attaches it as a Bearer header.
//
// On 401: attempts a token refresh using the refresh_token cookie, sets the
// new auth_token cookie, then retries the original request once.
// If the refresh fails or there is no refresh token, throws ApiRequestError(401).
//
// IMPORTANT: This file has NO "use server" directive intentionally.
// "use server" is ONLY for Server Action files (functions callable from client components).
// This is a plain server-side utility — it runs server-side because it imports
// from "next/headers", which is unavailable in the browser. No directive needed.
export async function apiRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  const res = await fetchWithToken(path, options, token);
  console.log("api request", res.status);
  if (res.status === 401) {
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/admin/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newAccessToken = refreshData.data?.accessToken;

        if (newAccessToken) {
          cookieStore.set("auth_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 900,
            path: "/",
          });

          const retryRes = await fetchWithToken(path, options, newAccessToken);

          if (!retryRes.ok) {
            const body = await retryRes.json().catch(() => ({}));
            throw new ApiRequestError(
              body?.message ?? `Request failed (${retryRes.status})`,
              retryRes.status,
            );
          }

          return retryRes;
        }
      }
    }

    throw new ApiRequestError("Session expired. Please log in again.", 401);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(
      body?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }

  return res;
}
