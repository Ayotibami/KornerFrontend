"use client";

// One editable cell in the targets tracker — click to reveal a tiny inline
// number input, Enter/blur saves via the targets upsert server action.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertTarget, type TargetKpiKey } from "@/app/admin/growth/action";

const STATUS_STYLES: Record<string, string> = {
  green: "bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]",
  amber: "bg-[#FEF3C7] dark:bg-[#422006] text-[#92400E] dark:text-[#FDE68A]",
  red: "bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]",
};

export default function TargetCell({
  month,
  kpiKey,
  target,
  actual,
  status,
}: {
  month: string;
  kpiKey: TargetKpiKey;
  target: number | null;
  actual: number | null;
  status: "green" | "amber" | "red" | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(target != null ? String(target) : "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const save = async () => {
    const num = Number(value);
    if (!value.trim() || !Number.isFinite(num)) {
      toast.error("Enter a number.");
      return;
    }
    setSaving(true);
    const result = await upsertTarget(month, kpiKey, num);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const statusClass = status ? STATUS_STYLES[status] : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400";

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-20 text-center text-xs rounded-lg border border-primary/40 bg-white dark:bg-[#0f1117] text-[#0f1e3d] dark:text-gray-100 px-1 py-1 outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to edit target"
      className={`w-full rounded-lg px-2 py-1.5 text-xs font-medium flex flex-col items-center gap-0.5 cursor-pointer transition-opacity hover:opacity-80 ${statusClass}`}
    >
      <span className="font-semibold">{actual != null ? actual.toLocaleString() : "—"}</span>
      <span className="opacity-70">/ {target != null ? target.toLocaleString() : "set target"}</span>
    </button>
  );
}
