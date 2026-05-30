"use client";

// Clickable trigger for the profile modal.
// Used twice in the Navbar: once as the avatar circle (left) and once as
// the User icon button (right). Each instance manages its own open state —
// only one can be open at a time since the user can only click one at a time.
//
// variant="avatar"  — renders the 50px avatar circle (replaces the static Avatar component)
// variant="icon"    — renders the User icon button (replaces the dead User icon)

import Image from "next/image";
import { useState } from "react";
import { User } from "lucide-react";
import { PRIMARY } from "@/constants/theme";
import ProfileModal from "./ProfileModal";
import type { AdminProfile } from "@/types/admin";

export default function ProfileTrigger({
  profile,
  variant,
}: {
  profile: AdminProfile | null;
  variant: "avatar" | "icon";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "avatar" ? (
        <button
          onClick={() => setOpen(true)}
          title="View profile"
          className="relative w-[50px] h-[50px] rounded-full border-2 border-primary bg-secondary overflow-hidden flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
        >
          {profile?.avatar_url && (
            <Image
              src={profile.avatar_url}
              fill
              alt="Admin avatar"
              className="object-cover"
              unoptimized
            />
          )}
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          title="View profile"
          className="cursor-pointer transition-opacity hover:opacity-70 active:opacity-50"
        >
          <User size={24} className="sm:w-7 sm:h-7" color={PRIMARY} />
        </button>
      )}

      {open && (
        <ProfileModal profile={profile} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
