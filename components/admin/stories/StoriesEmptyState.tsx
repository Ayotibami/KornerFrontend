// Shared empty state for both StoriesList and MasterStoriesList.
// Extracted so the two lists don't duplicate this SVG/copy.

import Link from "next/link";

export default function StoriesEmptyState({
  status,
  hasAnyStories,
}: {
  status?: string;
  hasAnyStories: boolean;
}) {
  // Derive the heading and sub-text based on two things:
  //   1. Which filter is active (status)
  //   2. Whether any stories exist at all (hasAnyStories)
  //
  // Why we need hasAnyStories:
  //   When the Draft filter is active and there are no drafts, `stories` (the filtered
  //   list) is empty — but there may be published or pending stories that DO exist.
  //   Without this flag, the Draft empty state would say "You have no stories yet"
  //   even when the admin has published stories. We use hasAnyStories to distinguish
  //   "no stories at all" from "no stories matching this filter".

  let heading: string;
  let subText: React.ReactNode;

  if (status === "Published") {
    heading = "No published stories yet";
    subText = "Publish a draft to see it here";
  } else if (status === "Pending") {
    heading = "No pending stories";
    subText = "Stories submitted for review will appear here";
  } else if (hasAnyStories) {
    // Stories exist but none are drafts
    heading = "No drafts yet";
    subText = (
      <>
        Go ahead and{" "}
        <Link href="/admin/stories/create" className="text-primary font-bold no-underline">
          create a new draft
        </Link>
      </>
    );
  } else {
    // Truly no stories at all
    heading = "You have no stories yet";
    subText = (
      <>
        Go ahead and{" "}
        <Link href="/admin/stories/create" className="text-primary font-bold no-underline">
          create one
        </Link>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 py-[clamp(40px,10vw,80px)] px-6">
      <svg
        viewBox="0 0 400 220"
        style={{ width: "clamp(240px, 60vw, 400px)", height: "auto" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="220" fill="#FFF7ED" rx="20" />
        <circle cx="320" cy="55" r="30" fill="#FBBF24" opacity="0.9" />
        <circle cx="320" cy="55" r="22" fill="#FDE68A" />
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <line key={i}
            x1={320 + Math.cos((angle * Math.PI) / 180) * 26}
            y1={55 + Math.sin((angle * Math.PI) / 180) * 26}
            x2={320 + Math.cos((angle * Math.PI) / 180) * 36}
            y2={55 + Math.sin((angle * Math.PI) / 180) * 36}
            stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"
          />
        ))}
        <ellipse cx="80" cy="180" rx="120" ry="40" fill="#F59E0B" opacity="0.4" />
        <ellipse cx="340" cy="185" rx="100" ry="35" fill="#F59E0B" opacity="0.4" />
        <path d="M0 155 Q100 130 200 148 Q300 165 400 140 L400 220 L0 220 Z" fill="#D97706" />
        <path d="M0 165 Q80 145 180 158 Q280 172 400 150 L400 220 L0 220 Z" fill="#F59E0B" />
        <path d="M0 178 Q100 162 200 172 Q300 182 400 165 L400 220 L0 220 Z" fill="#FCD34D" />
        <rect x="68" y="108" width="10" height="52" rx="5" fill="#16A34A" />
        <rect x="48" y="122" width="30" height="8" rx="4" fill="#16A34A" />
        <rect x="44" y="110" width="10" height="22" rx="5" fill="#16A34A" />
        <rect x="78" y="128" width="28" height="8" rx="4" fill="#16A34A" />
        <rect x="96" y="116" width="10" height="22" rx="5" fill="#16A34A" />
        <rect x="298" y="95" width="12" height="65" rx="6" fill="#15803D" />
        <rect x="274" y="118" width="34" height="9" rx="4" fill="#15803D" />
        <rect x="270" y="104" width="12" height="26" rx="6" fill="#15803D" />
        <rect x="308" y="124" width="32" height="9" rx="4" fill="#15803D" />
        <rect x="328" y="110" width="12" height="26" rx="6" fill="#15803D" />
        <ellipse cx="150" cy="170" rx="12" ry="7" fill="#B45309" opacity="0.6" />
        <ellipse cx="255" cy="175" rx="8" ry="5" fill="#B45309" opacity="0.5" />
        <ellipse cx="190" cy="182" rx="6" ry="4" fill="#92400E" opacity="0.5" />
        <circle cx="130" cy="162" r="7" fill="none" stroke="#92400E" strokeWidth="1.5" opacity="0.5" />
        <line x1="125" y1="157" x2="135" y2="167" stroke="#92400E" strokeWidth="1" opacity="0.5" />
        <line x1="135" y1="157" x2="125" y2="167" stroke="#92400E" strokeWidth="1" opacity="0.5" />
      </svg>

      <div className="text-center flex flex-col gap-2 font-nunito">
        <p className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-extrabold text-[#0f1e3d] dark:text-gray-50">
          {heading}
        </p>
        <p className="text-[clamp(0.85rem,2vw,1rem)] font-medium text-gray-500 dark:text-gray-400">
          {subText}
        </p>
      </div>
    </div>
  );
}
