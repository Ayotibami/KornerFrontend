import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional but common
});

export default function Button({
  children,
  inverted,
}: {
  children: React.ReactNode;
  inverted: boolean;
}) {
  return (
    <div
      onClick={() => {}}
      style={{
        backgroundColor: inverted ? "#112C4A" : "white",
        padding: 12,
        borderRadius: 12,
        cursor: "pointer",
      }}
    >
      <p
        style={{
          color: inverted ? "white" : "#112C4A",
          fontFamily: inter.style.fontFamily,
          fontWeight: 800,
        }}
      >
        {children}
      </p>
    </div>
  );
}
