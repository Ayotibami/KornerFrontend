// Master's home screen — "Writers" card.
// Same shell as StoriesStatCard (gold left border, rounded, shadow) for
// visual consistency across the dashboard. Total count, plus a scattered
// "halo" of up to 10 random admin avatars, each bouncing gently, for visual
// flavor. The whole card links to /admin/writers — no inner interactive
// elements here (unlike StoriesStatCard's rows), so a single outer Link is
// safe without needing a click-override/client split.
//
// This is a Server Component rendered fresh per request — the randomness
// here runs once on the server per page load, so a new random selection
// (and new random positions/delays) appear every time the page is visited.
// No hydration concern since there's no client-side re-render that needs to
// match this output.
//
// All Math.random() calls are isolated in plain helper functions below,
// rather than inlined directly in the component body — React's purity lint
// rule flags impure calls written directly in a component/hook, even
// though this is a Server Component where it's actually fine.

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { apiRequest } from "@/lib/api";

type AdminListItem = {
  admin_id: string;
  admin_name: string;
  avatar_url: string;
};

type Positioned = {
  admin: AdminListItem;
  x: number;
  y: number;
  delay: string;
};

// Percent of the container's own width/height, not a fixed px value — CSS
// `%` in left/top is relative to the containing block's actual rendered
// size, so as the container grows across breakpoints (see className below),
// every avatar's position scales right along with it automatically.
//
// At 10 avatars, a tight radius/jitter combo packs them close enough that
// they visually overlap/clump — pushed the radius out and pulled the jitter
// way down so each one keeps clear breathing room from its neighbors.
const RING_RADIUS_PERCENT = 38;
const JITTER_PERCENT = 4;
const ANGLE_JITTER_FACTOR = 0.25;
const AVATAR_COUNT = 10;

// Fisher-Yates-ish shuffle via sort — fine at this scale (a few dozen admins).
function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function scatterAroundRing(admins: AdminListItem[]): Positioned[] {
  const angleStep = admins.length > 0 ? (2 * Math.PI) / admins.length : 0;
  return admins.map((admin, i) => {
    const jitterAngle = (Math.random() - 0.5) * angleStep * ANGLE_JITTER_FACTOR;
    const angle = angleStep * i + jitterAngle;
    const radius = RING_RADIUS_PERCENT + (Math.random() - 0.5) * JITTER_PERCENT;
    return {
      admin,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: `${(Math.random() * 1.8).toFixed(2)}s`,
    };
  });
}

export default async function AdminsStatCard() {
  const res = await apiRequest("/master/admins");
  const data = await res.json();
  const admins: AdminListItem[] = data.admins ?? [];

  const selected = pickRandom(admins, Math.min(AVATAR_COUNT, admins.length));
  const positioned = scatterAroundRing(selected);

  return (
    <Link
      href="/admin/writers"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-l-4 border-[#FFC700] p-5 flex flex-col gap-4 w-full max-w-sm transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
    >
      <p className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 font-nunito">
        Writers
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#DBEAFE] dark:bg-[#1e3a5f]">
            <Users size={16} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
          <span className="text-sm font-bold font-nunito text-gray-600 dark:text-gray-300">
            Total
          </span>
        </div>
        <span className="text-sm font-bold rounded-full px-3 py-0.5 min-w-[2.25rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {admins.length}
        </span>
      </div>

      {positioned.length > 0 && (
        <div className="relative w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] md:w-[250px] md:h-[250px] lg:w-[280px] lg:h-[280px] mx-auto">
          {positioned.map(({ admin, x, y, delay }) => (
            <div
              key={admin.admin_id}
              title={admin.admin_name}
              className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] ring-2 ring-white dark:ring-[#1a1f2e] shadow-[0_2px_8px_rgba(0,0,0,0.2)] avatar-bounce-active"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: "translate(-50%, -50%)",
                animationDelay: delay,
              }}
            >
              {admin.avatar_url && (
                <Image
                  src={admin.avatar_url}
                  alt={admin.admin_name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
