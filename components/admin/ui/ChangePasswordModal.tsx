"use client";

import { useState } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { createPortal } from "react-dom";
import { Eye, EyeOff, X, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/app/admin/home/action";

const inputClass =
  "w-full bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a] rounded-xl px-4 py-2.5 outline-none font-medium text-[#374151] dark:text-gray-300 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600";

const rules = (p: string) => ({
  length: p.length >= 8,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  number: /[0-9]/.test(p),
});

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRules = rules(newPassword);
  const passwordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!passwordValid) {
      toast.error("New password doesn't meet the requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Password changed successfully.");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 dark:bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1f2e] rounded-2xl w-[90vw] max-w-[380px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
              <LockKeyhole size={15} className="text-primary dark:text-[#93b8f0]" />
            </div>
            <h2 className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50">
              Change password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {/* Current password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Rules */}
            {newPassword.length > 0 && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 px-0.5">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "upper",  label: "Uppercase letter" },
                  { key: "lower",  label: "Lowercase letter" },
                  { key: "number", label: "One number" },
                ].map(({ key, label }) => {
                  const passing = passwordRules[key as keyof typeof passwordRules];
                  return (
                    <span
                      key={key}
                      className={`flex items-center gap-1 text-xs font-semibold ${passing ? "text-[#065F46] dark:text-[#6EE7B7]" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      <span className="text-[10px]">{passing ? "✓" : "○"}</span>
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Mismatch hint */}
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400 px-0.5">
                Passwords don't match
              </p>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-5 w-full py-2.5 rounded-full bg-primary text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-transform hover:scale-[0.98] active:scale-95"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
