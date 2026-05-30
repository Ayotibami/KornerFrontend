// Fixed top navigation bar shown on all admin pages that use the home layout.
// Server component — fetches the admin profile on the server so there's no loading flash.
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
import CreateStoryButton from "./ui/CreateStoryButton";
import LogoutButton from "./ui/LogoutButton";
import ThemeToggle from "./ui/ThemeToggle";
import getProfile from "@/app/admin/home/action";

export default async function Navbar() {
  // getProfile() catches errors internally and returns null on failure,
  // so a broken profile endpoint won't crash the entire nav.
  const profile = await getProfile();

  return (
    <nav className="fixed top-0 left-0 right-0 h-[14vh] px-4 sm:px-5 flex items-center justify-between bg-white/90 dark:bg-[#1a1f2e]/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] z-10 box-border">
      {/* Left: avatar (opens profile modal) + greeting */}
      <div className="flex items-center gap-2.5 min-w-0 mr-2">
        <ProfileTrigger profile={profile} variant="avatar" />
        <AdminGreeting name={profile?.admin_name} />
      </div>

      {/* Right: action buttons — flex-shrink-0 prevents compression on narrow screens */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <CreateStoryButton />
        <ProfileTrigger profile={profile} variant="icon" />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </nav>
  );
}
