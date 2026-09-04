"use client";

// Renders a "time ago" string client-side only. formatDate() is a function of
// Date.now(), so SSR and hydration land on different values whenever any time
// passes between render and hydration — this avoids that mismatch by rendering
// nothing until after mount, then filling in the real value.

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

export default function RelativeTime({
  date,
  fallback = null,
}: {
  date: string | Date;
  fallback?: React.ReactNode;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatDate(date));
  }, [date]);

  return <>{label ?? fallback}</>;
}
