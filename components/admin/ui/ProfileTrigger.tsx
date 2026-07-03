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
        <div className="relative w-10 h-10 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            title="View profile"
            className="relative w-full h-full rounded-full border-2 border-primary bg-secondary overflow-hidden cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
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
          {profile?.role === "master" && (
            <svg
              viewBox="0 0 24 24"
              className="absolute -top-[9px] -left-[5px] w-6 h-6 pointer-events-none z-10 -rotate-[25deg]"
              style={{
                filter:
                  "drop-shadow(0 0 3px rgba(255,215,0,0.9)) drop-shadow(0 0 7px rgba(255,179,0,0.65))",
              }}
            >
              <defs>
                <linearGradient id="navCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE066" />
                  <stop offset="45%" stopColor="#FFC700" />
                  <stop offset="100%" stopColor="#E8A300" />
                </linearGradient>
              </defs>
              <path
                d="M3 18.5L1.6 7.8a0.8 0.8 0 0 1 1.24-0.77L7 9.8l4.2-5.4a1 1 0 0 1 1.6 0L17 9.8l4.16-2.77a0.8 0.8 0 0 1 1.24 0.77L21 18.5H3Z"
                fill="url(#navCrownGold)"
              />
              <rect x="3" y="18.5" width="18" height="2.2" rx="0.8" fill="url(#navCrownGold)" />
              <circle cx="2.4" cy="7.4" r="1.5" fill="#FFE066" />
              <circle cx="12" cy="4.3" r="1.6" fill="#FFE066" />
              <circle cx="21.6" cy="7.4" r="1.5" fill="#FFE066" />
            </svg>
          )}
        </div>
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
