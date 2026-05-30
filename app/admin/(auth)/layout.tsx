// Auth layout for /admin/login and /admin/signUp.
// Redirects logged-in admins away from the auth pages to the home page.
// This is the inverse of what middleware does:
//   middleware → redirects unauthenticated users TO login
//   this layout → redirects authenticated users AWAY FROM login/signUp
//
// Without this, a logged-in admin could still navigate to /admin/login
// and see the login form, which is confusing.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) redirect("/admin/home");
  return <>{children}</>;
}
