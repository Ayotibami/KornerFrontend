"use client";

// Theme toggle button shown in the Navbar between the profile icon and the logout button.
// Reads and writes to localStorage under the key "theme".
// Toggles the `dark` class on document.documentElement, which activates all `dark:` classes.
//
// Shows a Moon icon in light mode (click → go dark)
// Shows a Sun icon in dark mode (click → go light)
//
// The initial state is set by the anti-FOUC script in app/layout.tsx before hydration.
// This component syncs to whatever class is already on <html> on mount.

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync to the actual <html> class on mount — the anti-FOUC script may have already
  // set it from localStorage before React hydrated.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-95 active:scale-90 bg-secondary text-primary dark:bg-[#1e3a5f] dark:text-[#93b8f0]"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
