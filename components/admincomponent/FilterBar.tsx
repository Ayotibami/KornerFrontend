"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { nunito } from "@/lib/font";
import { primaryColor, secondaryColor } from "@/app/constants/color";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams.get("status"); // null = show all, "Draft" or "Published" = filtered

  const setFilter = (status: string) => {
    // clicking the active button again clears the filter
    if (active === status) {
      router.push("/admin/home");
    } else {
      router.push(`/admin/home?status=${status}`);
    }
  };

  const btnStyle = (status: string): React.CSSProperties => ({
    fontFamily: nunito.style.fontFamily,
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    fontWeight: 700,
    padding: "10px 32px",
    borderRadius: 30,
    border: "none",
    cursor: "pointer",
    backgroundColor: active === status ? primaryColor : secondaryColor,
    color: active === status ? "white" : primaryColor,
    transition: "background 0.2s, color 0.2s",
    boxShadow: active === status ? "0 2px 10px rgba(22,90,191,0.25)" : "none",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: "14vh",
        left: 0,
        right: 0,
        zIndex: 4,
        display: "flex",
        justifyContent: "center",
        gap: 16,
        padding: "12px 0",
        backgroundColor: "rgba(241, 245, 249, 0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      <button style={btnStyle("Draft")} onClick={() => setFilter("Draft")}>
        Draft
      </button>
      <button style={btnStyle("Published")} onClick={() => setFilter("Published")}>
        Published
      </button>
    </div>
  );
}
