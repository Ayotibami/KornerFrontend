"use server";

// Server utility for the Navbar — fetches the logged-in admin's profile.
// Kept in home/action.tsx because the Navbar is rendered inside the home layout,
// and this is the only place the profile is needed. Called on every admin
// page (11+ routes), so it's the single biggest lever on admin navigation
// speed — two layers of caching:
//   - React's cache() dedupes calls within one request. Several routes
//     (e.g. /admin/home) call getProfile() from both their layout and their
//     page — without this, that's two live network round trips for the
//     exact same data on one navigation.
//   - next.revalidate lets Next's Data Cache serve repeat calls *across*
//     navigations within the window without hitting the backend at all.
//     30s: short enough that a profile edit (name/avatar) shows up
//     elsewhere in the admin almost immediately, long enough to skip the
//     network round trip on the normal back-and-forth clicking around the
//     dashboard.
//
// Returns null on failure instead of throwing, so a broken /admin/profile endpoint
// won't crash the entire Navbar. The Navbar and AdminGreeting both handle null
// with graceful fallbacks (empty avatar circle, "Admin" name).

import { cache } from "react";
import { apiRequest } from "@/lib/api";
import type { AdminProfile } from "@/types/admin";
import type { ApiResult } from "@/types/api";

const getProfile = cache(async (): Promise<AdminProfile | null> => {
  try {
    const res = await apiRequest("/admin/profile", { next: { revalidate: 30 } });
    const { profile } = await res.json();

    return profile ?? null;
  } catch {
    return null;
  }
});

export default getProfile;

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/admin/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Failed to change password.";
    return { ok: false, status, message };
  }
}

export async function updateProfile(
  name: string,
  bio: string,
  avatar_url: string,
  avatar_public_id?: string,
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/admin/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, bio, avatar_url, avatar_public_id: avatar_public_id ?? null }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return { ok: false, status, message };
  }
}
