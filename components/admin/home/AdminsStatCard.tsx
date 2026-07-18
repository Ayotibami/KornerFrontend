import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { cloudinaryUrl } from "@/lib/utils";

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

const RING_RADIUS_PERCENT = 38;
const JITTER_PERCENT = 4;
const ANGLE_JITTER_FACTOR = 0.25;
const AVATAR_COUNT = 12;

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
  const res = await apiRequest("/master/admins?limit=12");
  const data = await res.json();
  const admins: AdminListItem[] = data.admins ?? [];
  const totalAdmins: number = data.total ?? admins.length;

  const selected = pickRandom(admins, Math.min(AVATAR_COUNT, admins.length));
  const positioned = scatterAroundRing(selected);

  return (
    <Link
      href="/admin/writers"
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border-l-4 border-[#FFC700] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-4 w-full transition-all duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-[#0f1e3d] dark:text-gray-100">
          Writers
        </p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF8E1] dark:bg-[#3a2e05]">
          <Users size={14} className="text-[#C77F00] dark:text-[#FFC700]" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#DBEAFE] dark:bg-[#1e3a5f]">
            <Users size={16} className="text-[#1e40af] dark:text-[#93c5fd]" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total
          </span>
        </div>
        <span className="text-xs font-semibold rounded-xl px-2.5 py-0.5 min-w-[2rem] text-center bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
          {totalAdmins}
        </span>
      </div>

      {positioned.length > 0 && (
        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] mx-auto">
          {positioned.map(({ admin, x, y, delay }) => (
            <div
              key={admin.admin_id}
              title={admin.admin_name}
              className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-[#2d3748] ring-2 ring-white dark:ring-[#1a1f2e] shadow-[0_2px_8px_rgba(0,0,0,0.2)] avatar-bounce-active"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: "translate(-50%, -50%)",
                animationDelay: delay,
              }}
            >
              {admin.avatar_url && (
                <Image
                  src={cloudinaryUrl(admin.avatar_url, 80)}
                  alt={admin.admin_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 36px, 40px"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
