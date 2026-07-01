"use client";

// Covers /admin/stories, /admin/stories/create, and /admin/stories/[storiId]
// (and its layout) — none of those have their own error.tsx, so this one
// catches errors anywhere in the stories section.

import { useEffect } from "react";
import ErrorState from "@/components/admin/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Stories section error:", error);
  }, [error]);

  return <ErrorState heading="Could not load stories" reset={reset} />;
}
