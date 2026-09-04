"use client";

import { useEffect, useRef, useState } from "react";

// Tracks scroll direction so a fixed bottom bar can get out of the way while
// the admin reads/writes down the page, and reappear the moment they scroll
// back up (or the page has nowhere left to scroll). Small per-frame deltas
// are ignored — direction only flips once movement since the last flip
// crosses THRESHOLD, so ordinary scroll jitter doesn't flicker it.
const THRESHOLD = 10;
const BOTTOM_SLOP = 40;

export function useHideOnScroll() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y <= 0;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_SLOP;

      if (atTop || atBottom) {
        setVisible(true);
        lastY.current = y;
        return;
      }

      const delta = y - lastY.current;
      if (delta > THRESHOLD) {
        setVisible(false); // scrolling down
        lastY.current = y;
      } else if (delta < -THRESHOLD) {
        setVisible(true); // scrolling up
        lastY.current = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
