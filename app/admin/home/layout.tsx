// Layout for all admin pages that show the Navbar.
// Sets the page background here so all admin routes (home, create, edit)
// inherit the correct light/dark background without each page setting it.
// pt-16 offsets content below the fixed Navbar (h-16 = 64px).

import type { ReactNode } from "react";
import Navbar from "@/components/admin/Navbar";
import AdminProvider from "@/context/AdminContext";
import BfcacheBypass from "@/components/admin/ui/BfcacheBypass";
import getProfile from "@/app/admin/home/action";

export default async function AdminHomeLayout({ children }: { children: ReactNode }) {
  // Fetched once here so Navbar and every nested page/component share the
  // same profile via AdminProvider, instead of each fetching it separately.
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <BfcacheBypass />
      <AdminProvider profile={profile}>
        <Navbar profile={profile} />
        <div className="pt-16 pb-5">
          {children}
        </div>
      </AdminProvider>
    </div>
  );
}
