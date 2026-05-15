import React from "react";
import { Plus } from "lucide-react";
export default function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="transition-all duration-300 hover:scale-95 active:scale-90"
      style={{
        backgroundColor: "#B4CFF6",
        padding: "20px 20px",
        borderRadius: 44,
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontSize: 14,
          color: "#0E3E87",
        }}
      >
        {children} <Plus size={14} style={{ display: "inline-block" }} />
      </p>
    </button>
  );
}
