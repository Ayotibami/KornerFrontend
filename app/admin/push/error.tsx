"use client";

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
    console.error("Push page error:", error);
  }, [error]);

  return <ErrorState heading="Could not load push" reset={reset} />;
}
