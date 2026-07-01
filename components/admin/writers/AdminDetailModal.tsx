"use client";

// Detail view for one admin, opened by clicking their avatar on the writers
// page. Same visual shape as ProfileModal's view mode (avatar, name, email,
// bio) plus role and verified status, which the master's own ProfileModal
// doesn't need to show. The management section is hidden for two cases:
// self (isSelf — the backend already rejects acting on your own account)
// and the one protected master account (is_protected, server-computed off
// a hardcoded email) that no other master is allowed to demote or delete.
//
// A "danger zone" section adds the two things verify/unverify alone don't
// cover: promoting/demoting between master and writer (single click + toast,
// reversible, so no typed confirm needed — same weight as verify/unverify),
// and permanently deleting the account (irreversible, routed through
// DeleteAdminModal's typed-DELETE confirm, same pattern as story deletion).
//
// Fetches on open rather than receiving data as a prop, same pattern as
// MailModal — keeps WriterCard from needing to hold full admin details for
// every row just in case its avatar gets clicked.

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, Loader2, ShieldCheck, ShieldAlert, Crown, Users, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { getAdminDetail, setAdminRole } from "@/app/admin/writers/action";
import DeleteAdminModal from "./DeleteAdminModal";
import type { AdminDetail } from "@/types/admin";

type FetchState = "loading" | "loaded" | "error";

const BTN_GOLD_SOFT =
  "flex items-center justify-center gap-2 w-full bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700] rounded-full px-4 py-2.5 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_RED_GHOST =
  "flex items-center justify-center gap-2 w-full bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5] rounded-full px-4 py-2.5 text-sm font-bold font-nunito hover:opacity-80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

export default function AdminDetailModal({
  adminId,
  isSelf,
  isOpen,
  onClose,
}: {
  adminId: string;
  isSelf: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminDetail | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    // adminId never changes for a given modal instance (one per WriterCard
    // row), so once loaded there's nothing to re-fetch on a later reopen —
    // skipping that avoids ever needing to reset state back to "loading"
    // synchronously inside the effect body, which is what the lint rule
    // below is actually warning about (it still allows setState from the
    // async callback, just not unconditionally at the top of the effect).
    if (!isOpen || admin) return;
    getAdminDetail(adminId).then((result) => {
      if (result.ok) {
        setAdmin(result.data);
        setFetchState("loaded");
      } else {
        setFetchError(result.message);
        setFetchState("error");
      }
    });
  }, [isOpen, adminId, admin]);

  const handleRoleToggle = () => {
    if (!admin) return;
    const nextRole = admin.role === "master" ? "writer" : "master";
    setIsChangingRole(true);
    setAdminRole(adminId, nextRole).then((result) => {
      setIsChangingRole(false);
      if (result.ok) {
        setAdmin((a) => (a ? { ...a, role: nextRole } : a));
        toast.success(`${admin.admin_name} is now a ${nextRole}.`);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-[90vw] max-w-[420px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] font-nunito"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50">
            Admin Profile
          </h2>
          <button
            onClick={onClose}
            title="Close"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {fetchState === "loading" && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        )}

        {fetchState === "error" && (
          <p className="text-sm text-red-500 text-center py-16">
            {fetchError ?? "Failed to load this admin's details."}
          </p>
        )}

        {fetchState === "loaded" && admin && (
          <>
            <div className="flex flex-col items-center gap-3 mb-6">
              <div
                className={`relative w-24 h-24 rounded-full overflow-hidden bg-secondary flex-shrink-0 ring-3 ${
                  admin.is_verified ? "ring-[#22C55E]" : "ring-[#DC2626]"
                }`}
              >
                {admin.avatar_url && (
                  <Image
                    src={admin.avatar_url}
                    fill
                    alt={admin.admin_name}
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-[#0f1e3d] dark:text-gray-50">
                  {admin.admin_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {admin.email}
                </p>
              </div>

              {/* Role + verified status pills */}
              <div className="flex items-center gap-2">
                {admin.role === "master" && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
                    <Crown size={12} className="crown-active" />
                    Master
                  </span>
                )}
                {admin.is_verified ? (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#D1FAE5] dark:bg-[#022C22] text-[#065F46] dark:text-[#6EE7B7]">
                    <ShieldCheck size={12} className="check-pop-active" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5]">
                    <ShieldAlert size={12} className="attention-pulse-active" />
                    Not verified
                  </span>
                )}
                {admin.is_protected && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF8E1] dark:bg-[#3a2e05] text-[#C77F00] dark:text-[#FFC700]">
                    <Lock size={12} />
                    Protected
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-sm text-[#374151] dark:text-gray-300">
                Bio
              </p>
              <div className="bg-[#F0F5FF] dark:bg-[#1e2a3a] rounded-xl px-4 py-3">
                <p className="text-sm text-[#374151] dark:text-gray-300 leading-relaxed">
                  {admin.bio || "No bio yet."}
                </p>
              </div>
            </div>

            {!isSelf && !admin.is_protected && (
              <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
                <p className="font-semibold text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Manage
                </p>
                <button
                  type="button"
                  onClick={handleRoleToggle}
                  disabled={isChangingRole}
                  className={BTN_GOLD_SOFT}
                >
                  {isChangingRole ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : admin.role === "master" ? (
                    <Users size={16} />
                  ) : (
                    <Crown size={16} />
                  )}
                  {admin.role === "master" ? "Demote to Writer" : "Promote to Master"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  className={BTN_RED_GHOST}
                >
                  <Trash2 size={16} />
                  Delete Admin
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {admin && (
        <DeleteAdminModal
          adminId={adminId}
          adminName={admin.admin_name}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => {
            setIsDeleteOpen(false);
            onClose();
          }}
        />
      )}
    </div>,
    document.body,
  );
}
