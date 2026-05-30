"use client";

// Personalized greeting in the Navbar — hydration-safe randomization (see comment below).
// Starts with "Hi" to match server render, then randomizes on client after hydration.
// Without this, React would get a hydration mismatch error.

import { useState, useEffect } from "react";

const GREETINGS = ["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"];

export default function AdminGreeting({ name }: { name?: string }) {
  const [greeting, setGreeting] = useState("Hi");

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  return (
    <p className="font-nunito text-[clamp(0.85rem,2vw,1rem)] font-extrabold truncate text-[#0f1e3d] dark:text-gray-50">
      {greeting}, {name ?? "Admin"}
      <span className="text-[clamp(18px,3vw,26px)] custom-shake">👋</span>
    </p>
  );
}
