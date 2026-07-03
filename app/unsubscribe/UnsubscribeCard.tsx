"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, MailX, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { unsubscribeEmail } from "./action";

type State = "idle" | "success" | "error";

export default function UnsubscribeCard({ email }: { email: string | null }) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    if (!email) return;
    setShowConfirm(false);
    startTransition(async () => {
      const result = await unsubscribeEmail(email);
      if (!result.ok) {
        setErrorMsg(result.message);
        setState("error");
        return;
      }
      setState("success");
    });
  };

  /* ── No email in URL ── */
  if (!email) {
    return (
      <Card>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
          <AlertCircle size={22} className="text-amber-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-bold text-[#0f1e3d]">Link don spoil</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The unsubscribe link no carry email address. Try clicking the link in your email again, or contact us directly.
          </p>
        </div>
        <BackLink />
      </Card>
    );
  }

  /* ── Success ── */
  if (state === "success") {
    return (
      <Card>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={22} className="text-emerald-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-bold text-[#0f1e3d]">You don go 😔</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            We don remove <strong className="text-[#0f1e3d] font-semibold">{email}</strong> from
            our list. E pain us, no lie — but we go respect am. If life bring you back to Korner,
            the subscribe button go dey there waiting.
          </p>
        </div>
        <BackLink />
      </Card>
    );
  }

  /* ── Idle + Error ── */
  return (
    <>
      {/* Dramatic confirm overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-7 flex flex-col items-center gap-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <span className="text-6xl leading-none select-none">😭</span>
            <div className="flex flex-col gap-1.5">
              <p className="font-bold text-[#0f1e3d] text-lg leading-snug">
                pleaseeee rethink this decision abeg
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                we don&apos;t want you to go 💔
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full mt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3.5 rounded-xl bg-[#0f1e3d] text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                WAIT, I&apos;M STAYING 🙏
              </button>
              <button
                onClick={handleUnsubscribe}
                disabled={isPending}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isPending
                  ? <span className="flex items-center justify-center gap-1.5"><Loader2 size={12} className="animate-spin" /> removing…</span>
                  : "no, just remove me 😔"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <MailX size={22} className="text-red-500" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-bold text-[#0f1e3d]">Unsubscribe</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            You wan remove <strong className="text-[#0f1e3d] font-semibold">{email}</strong> from
            the Korner mailing list? You no go receive story drops or newsletters
            again after this.
          </p>
        </div>

        {state === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{errorMsg}</p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            Yes, unsubscribe me
          </button>
          <Link
            href="/"
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
          >
            Keep me subscribed
          </Link>
        </div>
      </Card>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-8 flex flex-col gap-5">
      {children}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity flex items-center gap-1.5 w-fit"
    >
      <ArrowLeft size={14} />
      Back to Korner
    </Link>
  );
}
