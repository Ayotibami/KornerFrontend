// White card shell used for both the login and signup pages.
// Centers the form vertically and horizontally on a slate background.
// Dark mode: slate background → deep navy, white card → dark surface.

import type { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1117] flex items-center justify-center p-5 font-nunito">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)] w-full max-w-[460px] p-[clamp(28px,5vw,48px)] flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
