"use server";

// Server action called by LogoutButton in the Navbar.
// Deletes the auth_token cookie and redirects to the login page.
//
// Why delete the cookie server-side?
//   The auth_token cookie is httpOnly — JavaScript in the browser cannot access
//   or delete it (that's the security point of httpOnly). Only server-side code
//   can delete it, which is why this lives in a server action.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/admin/login");
}
