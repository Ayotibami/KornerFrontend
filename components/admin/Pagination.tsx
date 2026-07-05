import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  // Build the list of page numbers to show.
  // Always include page 1, the last page, and the two neighbours around currentPage.
  // Gaps become "..." entries.
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const base =
    "inline-flex items-center justify-center h-9 min-w-[36px] px-2.5 rounded-xl text-sm font-semibold transition-colors";

  return (
    <div className="flex items-center justify-center gap-1 py-5">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${base} text-[#0f1e3d] dark:text-gray-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]`}
        >
          ←
        </Link>
      ) : (
        <span className={`${base} text-gray-300 dark:text-gray-600 cursor-not-allowed`}>←</span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-sm text-gray-400 dark:text-gray-500 select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`${base} ${
              p === currentPage
                ? "bg-[#0f1e3d] text-white dark:bg-white dark:text-[#0f1e3d]"
                : "text-[#0f1e3d] dark:text-gray-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${base} text-[#0f1e3d] dark:text-gray-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]`}
        >
          →
        </Link>
      ) : (
        <span className={`${base} text-gray-300 dark:text-gray-600 cursor-not-allowed`}>→</span>
      )}
    </div>
  );
}
