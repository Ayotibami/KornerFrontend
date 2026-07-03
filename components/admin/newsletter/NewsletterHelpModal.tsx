"use client";

import { X, Send, History, Pencil, Ban, Repeat, Trash2, CheckCircle2, Clock } from "lucide-react";
import { createPortal } from "react-dom";

export default function NewsletterHelpModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f2e] z-10 flex justify-between items-start p-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="font-bold text-xl text-[#0f1e3d] dark:text-gray-50">
              Oya, make I explain newsletter 🗣️
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              How compose, schedule, and history work
            </p>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8">

          {/* ── Section 1: Composing ── */}
          <section>
            <h3 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              ✍️ How to send one
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                <>Write your <span className="font-bold">subject</span> and <span className="font-bold">body</span> on the Compose tab. Use the <span className="font-bold">+ name</span> button to drop a <span className="font-semibold text-primary dark:text-[#93b8f0]">{"{{name}}"}</span> tag that personalises the mail for each subscriber.</>,
                <>Pick <span className="font-bold">Send now</span> to fire it off immediately, or flip to <span className="font-bold">Schedule</span> to pick a date and time — the mail go land then instead.</>,
                <>Hit the button at the bottom. As soon as e go through, you land straight on the <span className="font-bold">History tab</span> so you fit confirm am dey there.</>,
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 2: Compose vs History ── */}
          <section>
            <h3 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              🔄 The two tabs
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-secondary/20 dark:bg-[#1e3a5f]/30 border border-secondary dark:border-[#1e3a5f]">
                <div className="w-8 h-8 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] flex items-center justify-center flex-shrink-0">
                  <Send size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Compose — where you write</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    Subject, body, and the send-now-or-schedule toggle all live here.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-[#EDE9FE]/40 dark:bg-[#2E1065]/30 border border-[#EDE9FE] dark:border-[#2E1065]">
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] dark:bg-[#2E1065] text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
                  <History size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">History — everything you&apos;ve sent or scheduled</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    Every newsletter shows up here, with a status badge and whatever actions make sense for it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: Status badges ── */}
          <section>
            <h3 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              🚦 Status badges
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={11} /> Sent
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Already gone out to every subscriber. <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">Can&apos;t be edited or unsent</span> — only deleted from history, or used as a starting point for a new one.
                </p>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5">
                  <Clock size={11} /> Scheduled
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Queued up for a future date/time. <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">Still editable</span> — you fit change the content or the send time, or cancel it outright before it goes.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 4: History card actions ── */}
          <section>
            <h3 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50 mb-1">
              🎛️ Actions on each card
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Which buttons show depends on the status</p>
            <div className="flex flex-col gap-2.5">
              {[
                { bg: "bg-secondary dark:bg-[#1e3a5f]", text: "text-primary dark:text-[#93b8f0]", icon: <Pencil size={14} />, label: "Edit — Scheduled only", desc: "Change the subject, body, or send time before it goes out." },
                { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-600 dark:text-amber-400", icon: <Ban size={14} />, label: "Cancel — Scheduled only", desc: "Stops the send completely. It won't go out." },
                { bg: "bg-secondary dark:bg-[#1e3a5f]", text: "text-primary dark:text-[#93b8f0]", icon: <Repeat size={14} />, label: "Resend — Sent only", desc: "Loads that mail's subject + body into Compose as a fresh draft so you can tweak it and send again. The old schedule isn't carried over." },
                { bg: "bg-[#FEE2E2] dark:bg-[#450a0a]", text: "text-[#DC2626] dark:text-[#FCA5A5]", icon: <Trash2 size={14} />, label: "Delete — Sent only", desc: "Removes it from history. Doesn't unsend — the mail already reached people." },
              ].map(({ bg, text, icon, label, desc }, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 dark:bg-[#1e2130]">
                  <div className={`w-8 h-8 rounded-full ${bg} ${text} flex items-center justify-center flex-shrink-0`}>{icon}</div>
                  <div>
                    <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 5: Tips ── */}
          <section>
            <h3 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              💡 Last last — remember these things
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { emoji: "🏷️", text: "The {{name}} tag works in both the subject and the body — each subscriber gets their own name dropped in." },
                { emoji: "📅", text: "Scheduling resets every time — Resend never reuses an old date/time, so you always pick fresh." },
                { emoji: "✅", text: "Sending or scheduling successfully takes you straight to History, so you can immediately see it listed." },
              ].map(({ emoji, text }, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{emoji}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">You don sabi am! 🎓</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Go write something your subscribers go enjoy 🚀
            </p>
          </div>

        </div>
      </div>
    </div>,
    document.body,
  );
}
