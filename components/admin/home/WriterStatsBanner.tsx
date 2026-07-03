import { BookText, PenLine, Clock, CheckCircle2, Eye } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Story } from "@/types/story";

export default async function WriterStatsBanner() {
  const res = await apiRequest("/stories/adminstories");
  const data = await res.json();
  const stories: Story[] = data.stories ?? [];

  const stats = [
    {
      icon: <BookText size={16} />,
      label: "Total",
      value: stories.length,
      iconBg: "bg-secondary dark:bg-[#1e3a5f]",
      iconColor: "text-primary dark:text-[#93b8f0]",
      valueColor: "text-[#0f1e3d] dark:text-gray-50",
    },
    {
      icon: <PenLine size={16} />,
      label: "Draft",
      value: stories.filter((s) => s.status === "Draft").length,
      iconBg: "bg-[#DBEAFE] dark:bg-[#1e3a5f]",
      iconColor: "text-[#1e40af] dark:text-[#93c5fd]",
      valueColor: "text-[#1e40af] dark:text-[#93c5fd]",
    },
    {
      icon: <Clock size={16} />,
      label: "Pending",
      value: stories.filter((s) => s.status === "Pending").length,
      iconBg: "bg-[#FEF3C7] dark:bg-[#422006]",
      iconColor: "text-[#92400E] dark:text-[#FDE68A]",
      valueColor: "text-[#92400E] dark:text-[#FDE68A]",
    },
    {
      icon: <CheckCircle2 size={16} />,
      label: "Published",
      value: stories.filter((s) => s.status === "Published").length,
      iconBg: "bg-[#D1FAE5] dark:bg-[#022C22]",
      iconColor: "text-[#065F46] dark:text-[#6EE7B7]",
      valueColor: "text-[#065F46] dark:text-[#6EE7B7]",
    },
    {
      icon: <Eye size={16} />,
      label: "Views",
      value: stories.reduce((sum, s) => sum + (s.views ?? 0), 0),
      iconBg: "bg-gray-100 dark:bg-[#1e2a3a]",
      iconColor: "text-gray-500 dark:text-gray-400",
      valueColor: "text-gray-700 dark:text-gray-300",
    },
  ];

  return (
    <div className="mx-3 sm:mx-4 mb-3 bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 py-1.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
              <span className={stat.iconColor}>{stat.icon}</span>
            </div>
            <p className={`text-xl font-bold leading-none ${stat.valueColor}`}>
              {stat.value}
            </p>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
