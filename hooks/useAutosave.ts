"use client";

// Debounced autosave hook — fires `save` after `delayMs` of inactivity
// in the watched deps, but skips the very first render so page-load
// doesn't trigger a pointless save of the server's own data back to itself.

import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(
  // Async function that performs the actual save.
  // The hook calls this after deps stop changing for delayMs.
  save: () => Promise<{ ok: boolean }>,
  // Same semantics as useEffect's dep array — timer resets on every change.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
  options?: {
    // Pass false to skip autosave entirely (e.g. when !isDirty on edit page,
    // or when the create page hasn't got a title yet).
    enabled?: boolean;
    delayMs?: number;
  },
): SaveStatus {
  const { enabled = true, delayMs = 3000 } = options ?? {};
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the save callback fresh on every render without it being a dep
  // of the debounce effect — if it were a dep, every render would restart
  // the timer even when the actual content hadn't changed.
  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; });

  // Skip autosave on the very first render — that's just the server data
  // being loaded into the editor, not a real user edit.
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      const result = await saveRef.current();
      if (result.ok) {
        setStatus("saved");
        // Fade the "Saved" indicator back to idle after 2 seconds
        setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
      } else {
        setStatus("error");
        // Fade the "Save failed" indicator after 3 seconds
        setTimeout(() => setStatus((s) => (s === "error" ? "idle" : s)), 3000);
      }
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // deps is intentionally dynamic — callers control what triggers the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);

  return status;
}
