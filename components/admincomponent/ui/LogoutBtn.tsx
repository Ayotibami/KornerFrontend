"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/admin/logout/action";

export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="transition-all duration-300 hover:scale-95 active:scale-90"
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isPending ? "default" : "pointer",
        backgroundColor: "#FEE2E2",
        flexShrink: 0,
      }}
      onClick={() => {
        if (isPending) return;
        startTransition(() => logout());
      }}
    >
      {isPending ? (
        <Loader2 size={16} color="#DC2626" className="animate-spin" />
      ) : (
        <LogOut size={16} color="#DC2626" />
      )}
    </div>
  );
}
