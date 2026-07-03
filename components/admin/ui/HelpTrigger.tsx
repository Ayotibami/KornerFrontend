"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import HelpModal from "./HelpModal";

export default function HelpTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        title="Help"
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
      >
        <HelpCircle size={17} />
      </button>
      {open && <HelpModal onClose={() => setOpen(false)} />}
    </>
  );
}
