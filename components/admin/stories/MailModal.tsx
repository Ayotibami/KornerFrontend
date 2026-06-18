"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import MailBodyEditor from "@/components/admin/editor/MailBodyEditor";
import { createPortal } from "react-dom";
import { X, Mail, Loader2, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getMail, createMail, updateMail, deleteMail } from "@/app/admin/stories/[storiId]/mailAction";

type FetchState = "loading" | "found" | "not-found" | "error";

const INPUT_BASE =
  "w-full font-nunito text-[0.95rem] border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 px-4 py-3 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white dark:focus:bg-[#243347] focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed";

const BTN_PRIMARY =
  "flex items-center gap-2 bg-primary text-white rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";
const BTN_GHOST =
  "flex items-center gap-2 bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_RED_SOFT =
  "flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_RED_SOLID =
  "flex items-center gap-2 bg-[#DC2626] text-white rounded-full px-6 py-2.5 text-sm font-bold font-nunito hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

export default function MailModal({
  storiId,
  isOpen,
  onClose,
}: {
  storiId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [templateUsed, setTemplateUsed] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const subjectRef = useRef<HTMLInputElement>(null);

  const insertNameInSubject = () => {
    const el = subjectRef.current;
    if (!el) { setSubject((s) => s + "{{name}}"); return; }
    const start = el.selectionStart ?? subject.length;
    const end   = el.selectionEnd   ?? subject.length;
    setSubject(subject.slice(0, start) + "{{name}}" + subject.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + "{{name}}".length;
      el.setSelectionRange(pos, pos);
    });
  };

  const useTemplate = () => {
    setSubject("Hey {{name}}, we don drop another stori o");
    setBody(
      "<p>Heyyyyyyyyyyy {{name}}</p><p>How far na, hope say you dey read your book???</p><p>Anyway we don come again!</p><p>We have dropped a new stori and we dont want you to miss this one so abeg quickly grab popcorn and hot zobo and hop into korner. We dey wait for you!</p>"
    );
    setTemplateUsed(true);
  };

  // Fetch mail every time the modal opens so data is always fresh
  useEffect(() => {
    if (!isOpen) return;
    setFetchState("loading");
    setSubject("");
    setBody("");
    setConfirmDelete(false);
    setTemplateUsed(false);
    setFetchError(null);

    getMail(storiId).then((result) => {
      if (!result.ok) {
        setFetchState("error");
        setFetchError(result.message);
        return;
      }
      if (result.data === null) {
        setFetchState("not-found");
      } else {
        setFetchState("found");
        setSubject(result.data.subject);
        setBody(result.data.body);
      }
    });
  }, [isOpen, storiId]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  const handleSave = () => {
    startSaving(async () => {
      const result =
        fetchState === "not-found"
          ? await createMail(storiId, subject, body)
          : await updateMail(storiId, subject, body);
      if (!result.ok) { toast.error(result.message); return; }
      toast.success(fetchState === "not-found" ? "Mail created." : "Mail saved.");
      setFetchState("found");
      onClose();
    });
  };

  const handleDelete = () => {
    startDeleting(async () => {
      const result = await deleteMail(storiId);
      if (!result.ok) { toast.error(result.message); setConfirmDelete(false); return; }
      toast.success("Mail deleted.");
      onClose();
    });
  };

  if (!isOpen) return null;

  const isForm = fetchState === "found" || fetchState === "not-found";
  const busy = isSaving || isDeleting;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-full max-w-[640px] max-h-[85vh] flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] font-nunito overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1f2e] z-10 flex justify-between items-center p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEE2E2] dark:bg-[#450a0a] flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-[#DC2626] dark:text-[#FCA5A5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#0f1e3d] dark:text-gray-50 leading-tight">
                Story Mail
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {fetchState === "found"
                  ? "Edit the mail attached to this story"
                  : "Compose a mail for this story"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading */}
          {fetchState === "loading" && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-primary" />
            </div>
          )}

          {/* Fetch error */}
          {fetchState === "error" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-sm text-red-500 text-center font-nunito">
                {fetchError ?? "Failed to load mail."}
              </p>
              <button className={BTN_GHOST} onClick={onClose}>
                Close
              </button>
            </div>
          )}

          {/* Form */}
          {isForm && (
            <div className="flex flex-col gap-5">

              {/* ── How this works ── */}
              <div className="rounded-2xl bg-[#F0F5FF] dark:bg-[#1e2a3a] border border-secondary dark:border-[#2a4a7a] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setInfoOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                  <p className="text-xs font-extrabold text-primary dark:text-[#93b8f0] font-nunito uppercase tracking-wide">How this works</p>
                  <ChevronDown
                    size={15}
                    className={`text-primary dark:text-[#93b8f0] transition-transform duration-200 flex-shrink-0 ${infoOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
                {infoOpen && (
                  <div className="px-4 pb-4 flex flex-col gap-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-nunito leading-relaxed">
                      Once your story goes <span className="font-bold text-[#0f1e3d] dark:text-gray-100">Published</span>, this mail fires off automatically to every subscriber on the Korner list — so give it some thought before you send.
                    </p>
                    <ul className="flex flex-col gap-2">
                      {[
                        { label: "Subject", desc: `The first thing they see before they even open it. Make it irresistible. "New post" is not it. "Your CGPA called, it's not happy 😅" is closer.` },
                        { label: "Body", desc: "Your pitch. Tell them what the story is about and why they need to drop everything and read it right now. Keep it short, keep it real." },
                        { label: "Cover image + read link", desc: "Already sorted. Your story's cover photo and a direct \"Read now\" link are added automatically to every mail. You don't need to add them." },
                        { label: "✨ Use template", desc: "First time creating a mail for this story? Hit that button and we'll prefill a Korner-branded subject and body for you. Edit it however you like or just send it as-is." },
                        { label: "+ name", desc: 'Click that button (in the subject or body toolbar) to drop {{name}} anywhere. Each subscriber gets their real name inserted there. "Hey Chisom, see this one" hits different than "Hey there."' },
                      ].map(({ label, desc }) => (
                        <li key={label} className="flex gap-2 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#93b8f0] mt-1.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-nunito leading-relaxed">
                            <span className="font-bold text-[#0f1e3d] dark:text-gray-100">{label}</span> — {desc}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Use template — only when creating, disappears after use */}
              {fetchState === "not-found" && !templateUsed && (
                <button
                  type="button"
                  onClick={useTemplate}
                  disabled={busy}
                  className="self-start flex items-center gap-2 text-sm font-bold font-nunito px-4 py-2 rounded-full bg-[#FEE2E2] text-[#DC2626] dark:bg-[#450a0a] dark:text-[#FCA5A5] hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  ✨ Use template
                </button>
              )}

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-primary font-nunito">Subject</label>
                  <button
                    type="button"
                    onClick={insertNameInSubject}
                    disabled={busy}
                    className="flex items-center gap-1 text-xs font-bold font-nunito px-2.5 py-1 rounded-lg bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none"
                  >
                    + name
                  </button>
                </div>
                <input
                  ref={subjectRef}
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. New story just dropped!"
                  disabled={busy}
                  className={`${INPUT_BASE} rounded-full`}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-primary font-nunito">Body</label>
                <MailBodyEditor
                  value={body}
                  onChange={setBody}
                  showNameButton
                  disabled={busy}
                  placeholder="Write your mail content here…"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky footer ── */}
        {isForm && (
          <div className="sticky bottom-0 bg-white dark:bg-[#1a1f2e] border-t border-slate-100 dark:border-slate-700 px-6 py-4 flex-shrink-0">
            {confirmDelete ? (
              /* Delete confirmation row */
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#0f1e3d] dark:text-gray-200 font-nunito">
                  Delete this mail?
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    className={BTN_GHOST}
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className={BTN_RED_SOLID}
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting
                      ? <><Loader2 size={14} className="animate-spin" /> Deleting…</>
                      : "Yes, delete"
                    }
                  </button>
                </div>
              </div>
            ) : (
              /* Normal footer */
              <div className={`flex ${fetchState === "found" ? "justify-between" : "justify-end"} items-center gap-3`}>
                {fetchState === "found" && (
                  <button
                    className={BTN_RED_SOFT}
                    onClick={() => setConfirmDelete(true)}
                    disabled={isSaving}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
                <button
                  className={BTN_PRIMARY}
                  onClick={handleSave}
                  disabled={busy || !subject.trim() || !body.trim()}
                >
                  {isSaving
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : fetchState === "not-found" ? "Create Mail" : "Save Changes"
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
