// Layout for all admin pages that show the Navbar.
// Sets the page background here so all admin routes (home, create, edit)
// inherit the correct light/dark background without each page setting it.
// pt-[14vh] offsets content below the fixed Navbar.

import type { ReactNode } from "react";
import Navbar from "@/components/admin/Navbar";

export default function AdminHomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117]">
      <Navbar />
      <div className="pt-[14vh] pb-5">
        {children}
      </div>
    </div>
  );
}
