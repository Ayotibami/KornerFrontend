"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Stories list error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-nunito">
      <p className="text-xl font-bold text-gray-700">Could not load stories</p>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        There was a problem connecting to the server. Check your connection and try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
