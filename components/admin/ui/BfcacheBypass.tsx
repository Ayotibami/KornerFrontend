"use client";

import { useEffect } from "react";

// When the browser restores a page from the back-forward cache (bfcache),
// it shows a frozen snapshot — no fetches run, no React re-renders happen.
// Pressing browser back from an editor hard-nav would show stale dashboard data.
// Listening for pageshow with e.persisted === true catches this case and
// forces a real reload so data is always fresh.
export default function BfcacheBypass() {
  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);
  return null;
}
