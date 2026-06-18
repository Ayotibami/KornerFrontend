"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FeatherIcon, Megaphone, Plus } from "lucide-react";

const ACTION_BTN =
  "w-14 h-14 rounded-full flex items-center justify-center bg-white/30 dark:bg-[#1a2744]/50 backdrop-blur-md border-4 border-primary dark:border-[#93b8f0] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-primary dark:text-[#93b8f0] hover:scale-110 active:scale-95 transition-transform";

// DOM order is top→bottom; visual stack is bottom→top.
// Feather (create) is closest to the Plus so it appears first (0ms delay).
// Megaphone (newsletter) appears 80ms later above it.
const ACTIONS = [
  { href: "/admin/newsletter",     icon: <Megaphone  size={22} />, label: "Newsletter",         delay: "80ms" },
  { href: "/admin/stories/create", icon: <FeatherIcon size={22} />, label: "Create new story", delay: "0ms"  },
];

export default function SpeedDialFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when the user clicks anywhere outside the FAB group
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-8 right-8 flex flex-col items-center gap-3 z-50">
      {ACTIONS.map(({ href, icon, label, delay }) => (
        <div
          key={href}
          className={`transition-all duration-200 ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{ transitionDelay: isOpen ? delay : "0ms" }}
        >
          <Link
            href={href}
            onClick={() => setIsOpen(false)}
            aria-label={label}
            className={ACTION_BTN}
            style={{ animation: isOpen ? "float 3s ease-in-out infinite" : "none" }}
          >
            {icon}
          </Link>
        </div>
      ))}

      {/* Anchor — solid, no float. Rotates + → × when open. */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close actions" : "Open actions"}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-primary text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus
          size={24}
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        />
      </button>
    </div>
  );
}
