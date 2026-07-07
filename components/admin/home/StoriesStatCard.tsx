import { Crown, PenLine, Clock, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import StoriesCardClient from "./StoriesCardClient";

export default async function StoriesStatCard() {
  const res = await apiRequest("/master/stories/counts");
  const data = await res.json();
  const counts = data.counts ?? { draft: 0, pending: 0, published: 0, mine: 0 };

  const rows = [
    {
      label: "Mine",
      href: "/admin/stories?mine=true",
      count: counts.mine,
      icon: <Crown size={16} className="text-[#C77F00] dark:text-[#FFC700] crown-active" />,
      iconBg: "bg-[#FFF8E1] dark:bg-[#3a2e05]",
      iconColor: "text-[#C77F00] dark:text-[#FFC700]",
      pillBg: "bg-[#FFF8E1] dark:bg-[#3a2e05]",
      pillColor: "text-[#C77F00] dark:text-[#FFC700]",
    },
    {
      label: "Draft",
      href: "/admin/stories?status=Draft",
      count: counts.draft,
      icon: <PenLine size={16} className="text-[#1e40af] dark:text-[#93c5fd] pen-write-active" />,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      pillBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      pillColor: "text-[#1e40af] dark:text-[#93c5fd]",
    },
    {
      label: "Pending",
      href: "/admin/stories?status=Pending",
      count: counts.pending,
      icon: <Clock size={16} className="text-[#92400E] dark:text-[#FDE68A] clock-spin-active" />,
      iconBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      iconColor: "text-[#92400E] dark:text-[#FDE68A]",
      pillBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      pillColor: "text-[#92400E] dark:text-[#FDE68A]",
    },
    {
      label: "Published",
      href: "/admin/stories?status=Published",
      count: counts.published,
      icon: <CheckCircle2 size={16} className="text-[#065F46] dark:text-[#6EE7B7] check-pop-active" />,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      pillBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      pillColor: "text-[#065F46] dark:text-[#6EE7B7]",
    },
  ];

  return <StoriesCardClient rows={rows} />;
}
