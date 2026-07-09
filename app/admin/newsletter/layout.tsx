import type { ReactNode } from "react";
import Navbar from "@/components/admin/Navbar";
import AdminProvider from "@/context/AdminContext";
import getProfile from "@/app/admin/home/action";

export default async function NewsletterLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117]">
      <AdminProvider profile={profile}>
        <Navbar profile={profile} />
        <div className="pt-16 pb-10">
          {children}
        </div>
      </AdminProvider>
    </div>
  );
}
