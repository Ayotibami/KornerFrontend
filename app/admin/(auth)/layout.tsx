import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) {
    redirect("/admin/home");
  }
  return <>{children}</>;
}
