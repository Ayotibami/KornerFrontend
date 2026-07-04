"use client";

import { X, Eye, Pencil, SendHorizonal, RotateCcw, BookCheck, FeatherIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function HelpModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
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
            <h2 className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50">
              Oya, I go yarn you everything 🗣️
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Short guide so you no go lost for here
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

          {/* ── Section 1: Creating a story ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              ✍️ How to born a story
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                <>See that <span className="inline-flex items-center gap-1 font-bold text-primary dark:text-[#93b8f0]"><FeatherIcon size={13} /> feather icon</span> floating at the <span className="font-bold">bottom-right corner</span> of this page? Tap am — that na your entry point to creating a story.</>,
                <>The page opens in <span className="font-bold text-[#0f1e3d] dark:text-gray-100">write mode</span> by default. Fill in your title, subtitle, a short excerpt, and how long e go take to read.</>,
                <>Add content blocks — heading, paragraph, quote, or image. Use the <span className="font-bold">+</span> controls between blocks to insert wherever you want.</>,
                <>When you don write, hit the <span className="inline-flex items-center gap-1 font-bold text-[#5B21B6] dark:text-[#C4B5FD]"><Eye size={13} /> violet eye button</span> on the right to preview your story.</>,
                <>In preview mode, <span className="font-bold text-[#065F46] dark:text-[#6EE7B7]">save as draft</span> to keep working later, or <span className="font-bold text-[#92400E] dark:text-[#FDE68A]">submit for review</span> when you don ready.</>,
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

          {/* ── Section 2: Write vs Read mode ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              🔄 The two modes — know them well
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-secondary/20 dark:bg-[#1e3a5f]/30 border border-secondary dark:border-[#1e3a5f]">
                <div className="w-8 h-8 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] flex items-center justify-center flex-shrink-0">
                  <Pencil size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Write mode — where the magic happen</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    Type, format, add blocks, upload images. Only the <span className="font-semibold">violet eye button</span> shows here — click am to preview.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-[#EDE9FE]/40 dark:bg-[#2E1065]/30 border border-[#EDE9FE] dark:border-[#2E1065]">
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] dark:bg-[#2E1065] text-[#5B21B6] dark:text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
                  <Eye size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Read mode — preview + action zone</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    See how your story go look. Three buttons appear on the right: <span className="font-semibold text-[#92400E] dark:text-[#FDE68A]">submit</span>, <span className="font-semibold text-[#065F46] dark:text-[#6EE7B7]">save as draft</span>, and <span className="font-semibold text-primary dark:text-[#93b8f0]">edit</span>. On edit page, save only shows when you change something.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 3: The action buttons (FABs) ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-1">
              🎛️ The floating buttons — what each one does
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">These appear on the right side of the screen in read mode</p>
            <div className="flex flex-col gap-2.5">
              {[
                { bg: "bg-[#FEF3C7] dark:bg-[#422006]", text: "text-[#92400E] dark:text-[#FDE68A]", icon: <SendHorizonal size={14} />, label: "Amber — Submit for review", desc: "Send your story to pending. Only shows for Draft stories." },
                { bg: "bg-[#CCFBF1] dark:bg-[#022C22]", text: "text-[#065F46] dark:text-[#6EE7B7]", icon: <BookCheck size={14} />, label: "Teal — Save as draft", desc: "Save your work without submitting. On edit page, only appears when you've changed something." },
                { bg: "bg-secondary dark:bg-[#1e3a5f]", text: "text-primary dark:text-[#93b8f0]", icon: <Pencil size={14} />, label: "Blue — Edit story", desc: "Go back to write mode to make more changes." },
                { bg: "bg-[#EDE9FE] dark:bg-[#2E1065]", text: "text-[#5B21B6] dark:text-[#C4B5FD]", icon: <Eye size={14} />, label: "Violet — Preview story", desc: "Only shows in write mode. Takes you to read/preview mode." },
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

          {/* ── Section 4: Story states ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              🚦 Story levels — from hustle to worldwide
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-[#DBEAFE]/50 dark:bg-[#1e3a5f]/30 border border-[#DBEAFE] dark:border-[#1e3a5f]">
                <span className="text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd] flex-shrink-0 mt-0.5">Draft</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your story dey chill in the shadows. <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">Nobody fit see am except you.</span> Edit am as much as you want, zero pressure.
                </p>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-[#FEF3C7]/50 dark:bg-[#422006]/30 border border-[#FEF9C3] dark:border-[#422006]">
                <span className="text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A] flex-shrink-0 mt-0.5">Pending</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  You don submit am for review. <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">Oga dey look am.</span> Sit down, drink water, relax. E go work out — or them go send am back to draft 😅
                </p>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-[#D1FAE5]/50 dark:bg-[#022C22]/30 border border-[#D1FAE5] dark:border-[#022C22]">
                <span className="text-xs px-2.5 py-1 rounded-xl font-semibold bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7] flex-shrink-0 mt-0.5">Published</span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-[#0f1e3d] dark:text-gray-100">E don go live!</span> The whole world fit read your masterpiece now. Collect your flowers 🌸
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 5: Card quick actions ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-1">
              ⚡ Card shortcuts — no need to open the story
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Each story card get small quick-action button at the bottom-right</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-slate-50 dark:bg-[#1e2130]">
                <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A] flex items-center justify-center flex-shrink-0">
                  <SendHorizonal size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Draft card → Submit for review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">One tap, story don submit. No need to even open am. Quick like that.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3.5 rounded-xl bg-slate-50 dark:bg-[#1e2130]">
                <div className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd] flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Pending card → Recall to Draft</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Changed your mind? The blue rotate button go drag your story back to Draft. No wahala.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 6: Filter bar ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              🗂️ The filter bar — switch your view
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
              That row of buttons at the very top of the home page — use am to switch between your story categories. The active one lights up with its own color.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-[#DBEAFE] text-[#1e40af] dark:bg-[#1e3a5f] dark:text-[#93c5fd]">Draft</span>
              <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FDE68A]">Pending</span>
              <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]">Published</span>
            </div>
          </section>

          {/* ── Section 7: Tips ── */}
          <section>
            <h3 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50 mb-3">
              💡 Last last — remember these things
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { emoji: "💾", text: "The save button on the edit page only appears when you actually change something. No change, no button — why save wetin you no edit?" },
                { emoji: "🖼️", text: "Image must finish uploading before you save. If the button dey spin, abeg wait — patience na virtue." },
                { emoji: "👤", text: "Click your avatar on the top-left to open your profile. You fit update your name, bio, and picture from there." },
                { emoji: "🌙", text: "The toggle button on the navbar top-right switches between light and dark mode. Use whichever one your eyes prefer abeg." },
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
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">You don learn everything! 🎓</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Now go create something beautiful. The world dey wait for your content abeg 🚀
            </p>
          </div>

        </div>
      </div>
    </div>,
    document.body,
  );
}
