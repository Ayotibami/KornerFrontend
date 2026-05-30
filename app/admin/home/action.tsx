// Server utility for the Navbar — fetches the logged-in admin's profile.
// Kept in home/action.tsx because the Navbar is rendered inside the home layout,
// and this is the only place the profile is needed.
//
// Returns null on failure instead of throwing, so a broken /admin/profile endpoint
// won't crash the entire Navbar. The Navbar and AdminGreeting both handle null
// with graceful fallbacks (empty avatar circle, "Admin" name).

import { apiRequest } from "@/lib/api";
import type { AdminProfile } from "@/types/admin";

const getProfile = async (): Promise<AdminProfile | null> => {
  try {
    const res = await apiRequest("/admin/profile");
    const { profile } = await res.json();
    return profile ?? null;
  } catch {
    return null;
  }
};

export default getProfile;
