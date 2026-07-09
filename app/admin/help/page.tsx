import Link from "next/link";
import { Crown, Feather, ArrowLeft, HelpCircle } from "lucide-react";
import getProfile from "@/app/admin/home/action";
import WriterHelp, { WRITER_NAV } from "@/components/admin/help/WriterHelp";
import MasterHelp, { MASTER_NAV } from "@/components/admin/help/MasterHelp";

export const metadata = { title: "Help | Korner Admin" };

export default async function HelpPage() {
  const profile = await getProfile();
  const isMaster = profile?.role === "master";
  const nav = isMaster ? MASTER_NAV : WRITER_NAV;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Go back ── */}
      <Link
        href="/admin/home"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0f1e3d] dark:hover:text-gray-100 transition-colors mb-6 group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={16} className="text-gray-400 dark:text-gray-500" />
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Help Centre
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isMaster
                ? "bg-amber-100 dark:bg-[#422006] text-amber-600 dark:text-[#FDE68A]"
                : "bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0]"
            }`}
          >
            {isMaster ? <Crown size={20} /> : <Feather size={20} />}
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
              {isMaster ? "Master Guide" : "Writer Guide"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isMaster
                ? "Full platform documentation — every feature, explained."
                : "Everything you need to create and manage your stories."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">

        {/* ── Sticky sidebar (desktop only) ── */}
        <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-3 flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 pt-1 pb-2">
              Sections
            </p>
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#0f1e3d] dark:hover:text-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors leading-snug"
              >
                {item.title}
              </a>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {isMaster ? <MasterHelp /> : <WriterHelp />}

          {/* Footer */}
          <div className="mt-8 p-6 bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] text-center">
            <p className="font-extrabold text-[#0f1e3d] dark:text-gray-50">
              You've read everything. Now go create. 🚀
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              If something still isn't clear, reach out to the team.
            </p>
          </div>
        </main>

      </div>
    </div>
  );
}
