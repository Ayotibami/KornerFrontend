"use client";

import { useEffect } from "react";

export default function ViewTracker({ storiId }: { storiId: string }) {
  useEffect(() => {
    fetch(`/api/view/${storiId}`, { method: "POST" }).catch(() => {});
  }, [storiId]);

  return null;
}
