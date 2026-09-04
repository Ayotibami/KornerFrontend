import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function HelpTrigger({ href = "/admin/help" }: { href?: string }) {
  return (
    <Link
      href={href}
      title="Help"
      className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
    >
      <HelpCircle size={17} />
    </Link>
  );
}
