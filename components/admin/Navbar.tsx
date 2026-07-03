import AdminGreeting from "./AdminGreeting";
import ProfileTrigger from "./ui/ProfileTrigger";
import LogoutButton from "./ui/LogoutButton";
import ThemeToggle from "./ui/ThemeToggle";
import HelpTrigger from "./ui/HelpTrigger";
import type { AdminProfile } from "@/types/admin";

export default function Navbar({ profile }: { profile: AdminProfile | null }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 px-5 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/[0.06] z-50">
      <div className="flex items-center gap-3 min-w-0 mr-3">
        <ProfileTrigger profile={profile} variant="avatar" />
        <AdminGreeting name={profile?.admin_name} />
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <HelpTrigger />
        <ThemeToggle />
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1.5" />
        <LogoutButton />
      </div>
    </nav>
  );
}
