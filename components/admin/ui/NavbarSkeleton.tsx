import Skeleton from "./Skeleton";

// Mirrors Navbar.tsx's exact layout (avatar + greeting left, help/theme/
// logout icons right) so pages that render Navbar themselves (no shared
// admin layout provides it) don't show a layout jump once the real one
// mounts with the fetched profile.
export default function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 px-5 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/[0.06] z-50">
      <div className="flex items-center gap-3 min-w-0 mr-3">
        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
        <Skeleton className="h-4 w-24 rounded-full hidden sm:block" />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1.5" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
    </nav>
  );
}
