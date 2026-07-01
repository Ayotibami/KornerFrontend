// Fixed top navigation bar shown on all admin pages that use the home layout.
// Server component — receives the admin profile as a prop (fetched once by
// the layout) so there's no loading flash and no duplicate fetch.
//
// Layout:
//   Left  — avatar circle (clickable → profile modal) + personalized greeting
//   Right — create story, profile icon (clickable → profile modal), theme toggle, logout
//
// `h-[14vh]` height is intentional — layouts below the Navbar use `pt-[14vh]`
// to push their content below the fixed bar.
//
// backdrop-blur-sm + bg-white/90 gives a frosted-glass look so content
// scrolling behind the navbar is legible. Dark mode uses the dark surface color.
//
// Right section uses gap-2 on mobile and gap-2.5 on sm+ so icons stay compact
// on small screens without overlapping.

import AdminGreeting from "./AdminGreeting";
import ProfileTrigger from "./ui/ProfileTrigger";
import LogoutButton from "./ui/LogoutButton";
import ThemeToggle from "./ui/ThemeToggle";
import HelpTrigger from "./ui/HelpTrigger";
import type { AdminProfile } from "@/types/admin";

export default function Navbar({ profile }: { profile: AdminProfile | null }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[14vh] px-4 sm:px-5 flex items-center justify-between bg-white/90 dark:bg-[#1a1f2e]/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-10 box-border">
      {/* Left: avatar (opens profile modal) + greeting */}
      <div className="flex items-center gap-2.5 min-w-0 mr-2">
        <ProfileTrigger profile={profile} variant="avatar" />
        <AdminGreeting name={profile?.admin_name} />
      </div>

      {/* Right: action buttons — flex-shrink-0 prevents compression on narrow screens */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <HelpTrigger />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </nav>
  );
}
