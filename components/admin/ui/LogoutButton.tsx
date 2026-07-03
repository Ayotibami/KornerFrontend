"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/admin/logout/action";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => !isPending && startTransition(() => logout())}
      disabled={isPending}
      aria-label="Logout"
      className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex-shrink-0 transition-all cursor-pointer disabled:cursor-default disabled:opacity-60"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
    </button>
  );
}
