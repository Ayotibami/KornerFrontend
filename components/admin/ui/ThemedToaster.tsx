"use client";

// Client wrapper around Sonner's Toaster so it tracks the dark class on <html>
// and passes the correct theme prop. Without this, Sonner always renders in light mode
// regardless of the admin's dark mode toggle.
//
// Uses a MutationObserver to react to class changes on the html element,
// so the toast theme updates immediately when ThemeToggle is clicked.

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function ThemedToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const update = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");

    update(); // read initial state after hydration

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return <Toaster position="top-right" richColors theme={theme} />;
}
