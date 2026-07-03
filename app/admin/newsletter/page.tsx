"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, Megaphone, Send, History } from "lucide-react";
import { useState } from "react";
import NewsletterForm from "./NewsletterForm";
import NewsletterHistoryList from "./NewsletterHistoryList";
import NewsletterHelpModal from "@/components/admin/newsletter/NewsletterHelpModal";

type Tab = "compose" | "history";
type Prefill = { subject: string; body: string; imageUrl: string | null };

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("compose");
  const [composePrefill, setComposePrefill] = useState<Prefill | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-6">

      {/* Go back + Help */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/home"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 no-underline transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Go back
        </Link>
        <button
          title="Help — how the newsletter works"
          onClick={() => setHelpOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <HelpCircle size={18} />
        </button>
      </div>
      {helpOpen && <NewsletterHelpModal onClose={() => setHelpOpen(false)} />}

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">

        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary dark:bg-[#1e3a5f] flex items-center justify-center">
            <Megaphone size={22} className="text-primary dark:text-[#93b8f0]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0f1e3d] dark:text-gray-50">
              Newsletter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed max-w-md mx-auto">
              Send a mail straight to every subscriber on the Korner list — no story attached, just you
              talking to your audience directly. Use it for announcements, updates, hype, whatever.
              Write it once, personalise it with{" "}
              <span className="font-semibold text-[#0f1e3d] dark:text-gray-200">{"{{name}}"}</span>,
              then fire it off now or schedule it to land at exactly the right moment.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-20 flex border-b border-slate-200 dark:border-slate-700 bg-[#f8f9fb] dark:bg-[#0f1117]">
          <button
            type="button"
            onClick={() => setTab("compose")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150 cursor-pointer ${
              tab === "compose"
                ? "border-primary text-primary dark:text-[#93b8f0] dark:border-[#93b8f0]"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Send size={14} />
            Compose
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150 cursor-pointer ${
              tab === "history"
                ? "border-primary text-primary dark:text-[#93b8f0] dark:border-[#93b8f0]"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <History size={14} />
            History
          </button>
        </div>

        {/* Tab content */}
        {tab === "compose" ? (
          <NewsletterForm
            prefill={composePrefill}
            onSent={() => {
              setComposePrefill(null);
              setTab("history");
            }}
          />
        ) : (
          <NewsletterHistoryList
            onUseAsTemplate={(subject, body, imageUrl) => {
              setComposePrefill({ subject, body, imageUrl });
              setTab("compose");
            }}
          />
        )}

      </div>
    </div>
  );
}
