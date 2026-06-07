"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import HelpModal from "./HelpModal";

export default function HelpTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        title="Help — e go make sense, I promise"
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-primary dark:text-[#93b8f0] hover:bg-secondary/40 dark:hover:bg-[#1e3a5f]/50 transition-colors cursor-pointer"
      >
        <HelpCircle size={20} />
      </button>
      {open && <HelpModal onClose={() => setOpen(false)} />}
    </>
  );
}
