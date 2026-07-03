import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f1117] flex items-center justify-center p-4 lg:p-0 lg:grid lg:grid-cols-[420px_1fr] lg:items-stretch">

      {/* ── Left brand panel (desktop only) ──────────────────── */}
      <div className="hidden lg:flex flex-col items-center justify-between bg-primary px-12 py-12 relative overflow-hidden min-h-screen">
        {/* Decorative rings */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border border-white/[0.08]" />
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full border border-white/[0.06]" />
        <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full border border-white/[0.08]" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02]" />

        <div />

        {/* Centre content */}
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
            <Image src="/images/logo.png" alt="Korner logo" width={34} height={34} className="object-contain" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Korner Admin</h1>
            <p className="text-white/55 text-sm leading-relaxed max-w-[220px] mx-auto">
              Your stories, your audience — managed from one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-2 mt-2">
            {["Publish & schedule stories", "Send newsletters & push", "Manage your team"].map((f) => (
              <div key={f} className="flex items-center gap-2.5 bg-white/[0.08] rounded-xl px-4 py-2.5 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] flex-shrink-0" />
                <span className="text-white/75 text-xs font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/30 text-xs">by Kampos</p>
      </div>

      {/* ── Right form panel ──────────────────────────────────── */}
      <div className="flex items-center justify-center w-full lg:bg-white lg:dark:bg-[#1a1f2e] lg:min-h-screen py-8 lg:py-0">
        <div className="w-full max-w-[420px] bg-white dark:bg-[#1a1f2e] rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] p-8 flex flex-col gap-6 lg:shadow-none lg:rounded-none lg:p-10 xl:p-14 lg:max-w-[480px]">

          {/* Mobile-only mini header */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Image src="/images/logo.png" alt="Logo" width={16} height={16} className="object-contain" />
            </div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">Korner Admin · by Kampos</span>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
}
