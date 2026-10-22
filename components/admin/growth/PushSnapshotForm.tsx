"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPushSnapshot } from "@/app/admin/growth/action";

export default function PushSnapshotForm() {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(value, 10);
    if (!Number.isInteger(count) || count < 0) {
      toast.error("Enter a non-negative whole number.");
      return;
    }
    setSubmitting(true);
    const result = await createPushSnapshot(count);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Snapshot saved.");
    setValue("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Current push subscriber count"
        className="flex-1 min-w-0 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary dark:focus:border-[#4d7ab5] focus:ring-2 focus:ring-primary/10 transition-all"
      />
      <button
        type="submit"
        disabled={submitting || value === ""}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer flex-shrink-0"
      >
        {submitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
