"use client";

// Shared body for every admin section's error.tsx — one error boundary per
// section (not per page) is enough, since Next.js automatically lets an
// error.tsx cover its own page plus any nested pages that don't have their
// own. Each section's error.tsx just supplies its own heading text and
// renders this.

export default function ErrorState({
  heading,
  reset,
}: {
  heading: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-xl font-bold text-gray-700 dark:text-gray-200">{heading}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
        There was a problem connecting to the server. Check your connection and try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
