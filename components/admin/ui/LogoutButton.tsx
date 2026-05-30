"use client";

// Logout button shown in the Navbar.
// Calls the logout server action via useTransition so the button shows a spinner
// while the server is deleting the auth cookie and redirecting.
// Red background/icon signals a destructive action visually.

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
      className="w-9 h-9 rounded-full flex items-center justify-center bg-red-100 text-red-600 flex-shrink-0 transition-transform hover:scale-95 active:scale-90 disabled:cursor-default disabled:opacity-70"
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
    </button>
  );
}
