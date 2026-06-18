import type { ReactNode } from "react";
import Navbar from "@/components/admin/Navbar";

export default function NewsletterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117]">
      <Navbar />
      <div className="pt-[14vh] pb-10">
        {children}
      </div>
    </div>
  );
}
