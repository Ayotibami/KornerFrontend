"use client";

import { useState, useEffect } from "react";

const GREETINGS = ["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"];

export default function AdminGreeting({ name }: { name?: string }) {
  const [greeting, setGreeting] = useState("Hi");

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  return (
    <p className="text-[clamp(0.8rem,2vw,0.9rem)] font-semibold truncate text-[#1a1a2e] dark:text-white/90 leading-none">
      {greeting},{" "}
      <span className="text-primary dark:text-[#93b8f0]">{name ?? "Admin"}</span>
      <span className="ml-1 text-[clamp(15px,2.5vw,19px)] custom-shake inline-block">👋</span>
    </p>
  );
}
