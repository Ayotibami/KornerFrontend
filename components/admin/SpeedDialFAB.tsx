"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FeatherIcon, Megaphone, Plus, TrendingUp } from "lucide-react";

const ACTIONS = [
  { href: "/admin/growth",         icon: <TrendingUp size={20} />, label: "Growth dashboard", delay: "120ms", masterOnly: true },
  { href: "/admin/newsletter",     icon: <Megaphone  size={20} />, label: "Newsletter",       delay: "60ms",  masterOnly: false },
  { href: "/admin/stories/create", icon: <FeatherIcon size={20} />, label: "Create new story", delay: "0ms",  masterOnly: false },
];

export default function SpeedDialFAB({ isMaster = false }: { isMaster?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Growth dashboard redirects non-master roles straight back to /admin/home
  // server-side — filtering it out here just avoids a dead-end tap for them.
  const actions = ACTIONS.filter((a) => !a.masterOnly || isMaster);

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
    <div ref={containerRef} className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 flex flex-col items-center gap-3 z-50">
      {actions.map(({ href, icon, label, delay }) => (
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
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-[#1a1f2e] text-primary dark:text-[#93b8f0] shadow-[0_4px_16px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-transform"
            style={{ animation: isOpen ? "float 3s ease-in-out infinite" : "none" }}
          >
            {icon}
          </Link>
        </div>
      ))}

      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close actions" : "Open actions"}
        className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center bg-primary text-white shadow-[0_4px_16px_rgba(22,90,191,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus
          size={22}
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        />
      </button>
    </div>
  );
}
