"use server";

// Server utility for the Navbar — fetches the logged-in admin's profile.
// Kept in home/action.tsx because the Navbar is rendered inside the home layout,
// and this is the only place the profile is needed.
//
// Returns null on failure instead of throwing, so a broken /admin/profile endpoint
// won't crash the entire Navbar. The Navbar and AdminGreeting both handle null
// with graceful fallbacks (empty avatar circle, "Admin" name).

import { apiRequest } from "@/lib/api";
import type { AdminProfile } from "@/types/admin";
import type { ApiResult } from "@/types/api";

const getProfile = async (): Promise<AdminProfile | null> => {
  try {
    const res = await apiRequest("/admin/profile");
    const { profile } = await res.json();
    console.log(profile, "tor");
    return profile ?? null;
  } catch {
    return null;
  }
};

export default getProfile;

export async function updateProfile(
  name: string,
  bio: string,
  avatar_url: string,
): Promise<ApiResult<void>> {
  try {
    await apiRequest("/admin/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, bio, avatar_url }),
    });
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return { ok: false, status, message };
  }
}
