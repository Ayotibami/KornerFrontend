"use client";

import { useRef } from "react";
import { nunito } from "@/lib/font";

const GREETINGS = ["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"];

export default function AdminGreeting({ name }: { name?: string }) {
  const greeting = useRef(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  return (
    <p
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(0.85rem, 2vw, 1rem)",
        fontWeight: 800,
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {greeting.current}, {name ?? "Admin"}
      <span style={{ fontSize: "clamp(18px, 3vw, 26px)" }} className="custom-shake">
        👋
      </span>
    </p>
  );
}
