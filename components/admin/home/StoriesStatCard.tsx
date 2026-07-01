// Master's home screen — "Stories" card.
// Fetches /master/stories once and derives all four counts from it in JS
// (Draft/Pending/Published from .status, Mine from is_own_story) — there's
// no backend "counts" endpoint, the full list already has everything needed.
//
// Gold touch per the "royalty" treatment for master UI: a soft gold left
// border on the card, each count in a small tinted pill, and Mine specifically
// gets the gold crown (it's literally "the master's own"), listed first.
//
// The whole card navigates to /admin/stories (all admins, no status filter).
// Each row overrides that with its own more specific destination — Draft/
// Pending/Published pre-filter by status, Mine scopes to just the master's
// own. That click-override logic needs client JS, so the actual rendering
// (and the icon elements, pre-built here since a Server Component can pass
// rendered JSX to a Client Component but not a raw component reference)
// lives in StoriesCardClient.

import { Crown, PenLine, Clock, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { MasterStory } from "@/types/story";
import StoriesCardClient from "./StoriesCardClient";

export default async function StoriesStatCard() {
  const res = await apiRequest("/master/stories");
  const data = await res.json();
  const stories: MasterStory[] = data.stories ?? [];

  const rows = [
    {
      label: "Mine",
      href: "/admin/stories?mine=true",
      count: stories.filter((s) => s.is_own_story).length,
      icon: <Crown size={16} className="text-[#C77F00] dark:text-[#FFC700] crown-active" />,
      iconBg: "bg-[#FFF8E1] dark:bg-[#3a2e05]",
      iconColor: "text-[#C77F00] dark:text-[#FFC700]",
      pillBg: "bg-[#FFF8E1] dark:bg-[#3a2e05]",
      pillColor: "text-[#C77F00] dark:text-[#FFC700]",
    },
    {
      label: "Draft",
      href: "/admin/stories?status=Draft",
      count: stories.filter((s) => s.status === "Draft").length,
      icon: <PenLine size={16} className="text-[#1e40af] dark:text-[#93c5fd] pen-write-active" />,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      pillBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      pillColor: "text-[#1e40af] dark:text-[#93c5fd]",
    },
    {
      label: "Pending",
      href: "/admin/stories?status=Pending",
      count: stories.filter((s) => s.status === "Pending").length,
      icon: <Clock size={16} className="text-[#92400E] dark:text-[#FDE68A] clock-spin-active" />,
      iconBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      iconColor: "text-[#92400E] dark:text-[#FDE68A]",
      pillBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      pillColor: "text-[#92400E] dark:text-[#FDE68A]",
    },
    {
      label: "Published",
      href: "/admin/stories?status=Published",
      count: stories.filter((s) => s.status === "Published").length,
      icon: <CheckCircle2 size={16} className="text-[#065F46] dark:text-[#6EE7B7] check-pop-active" />,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      pillBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      pillColor: "text-[#065F46] dark:text-[#6EE7B7]",
    },
  ];

  return <StoriesCardClient rows={rows} />;
}
