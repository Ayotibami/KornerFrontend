"use client";

import Image from "next/image";
import { cloudinaryUrl } from "@/lib/utils";
import { Pencil, X, Crown, Feather } from "lucide-react";
import { useState } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import AvatarPicker from "./AvatarPicker";
import ChangePasswordModal from "./ChangePasswordModal";
import { updateProfile } from "@/app/admin/home/action";
import type { AdminProfile } from "@/types/admin";

const inputClass =
  "w-full bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a] rounded-xl px-4 py-2.5 outline-none font-medium text-[#374151] dark:text-gray-300 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-[border-color] focus:border-primary";

export default function ProfileModal({
  profile,
  onClose,
}: {
  profile: AdminProfile | null;
  onClose: () => void;
}) {
  useEscapeKey(onClose);
  const [isEdit, setIsEdit] = useState(false);
  const [localName, setLocalName] = useState(profile?.admin_name ?? "");
  const [localBio, setLocalBio] = useState(profile?.bio ?? "");
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(profile?.avatar_url ?? "");
  const [localAvatarPublicId, setLocalAvatarPublicId] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const router = useRouter();
  const isMaster = profile?.role === "master";

  const handleSave = async () => {
    if (!localName.trim()) { toast.error("Name is required."); return; }
    setSaving(true);
    const result = await updateProfile(localName, localBio, localAvatarUrl, localAvatarPublicId || undefined);
    setSaving(false);
    if (!result.ok) { toast.error(result.message); return; }
    toast.success("Profile updated.");
    setIsEdit(false);
    router.refresh();
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="relative bg-white dark:bg-[#1a1f2e] rounded-3xl w-[90vw] max-w-[400px] shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isEdit ? (
              /* ── Edit mode ───────────────────────────────────── */
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base text-[#0f1e3d] dark:text-gray-50">Edit Profile</h2>
                  <button onClick={onClose} title="Close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex justify-center">
                  <AvatarPicker
                    initialUrl={localAvatarUrl ?? undefined}
                    onUploadComplete={({ url, publicId }) => {
                      setLocalAvatarUrl(url);
                      setLocalAvatarPublicId(publicId);
                    }}
                    onUploadingChange={setAvatarUploading}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Email</label>
                  <p className={`${inputClass} opacity-50 cursor-default select-all`}>{profile?.email ?? "—"}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Name</label>
                  <input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Bio</label>
                  <textarea
                    value={localBio ?? ""}
                    onChange={(e) => setLocalBio(e.target.value)}
                    placeholder="Write a short bio…"
                    rows={3}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setIsEdit(false)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={avatarUploading || saving}
                    onClick={handleSave}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {avatarUploading ? "Uploading…" : saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            ) : (
              /* ── View mode ───────────────────────────────────── */
              <>
                {/* Avatar banner */}
                <div className="bg-gradient-to-br from-secondary/60 to-secondary/20 dark:from-[#1e3a5f]/60 dark:to-[#1e3a5f]/20 px-6 pt-10 pb-6 flex flex-col items-center gap-3 relative">
                  <button
                    onClick={onClose}
                    title="Close"
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={() => setIsEdit(true)}
                    title="Edit profile"
                    className="absolute top-3 right-12 w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary dark:hover:text-[#93b8f0] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* Avatar */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-secondary dark:bg-[#1e3a5f] flex-shrink-0 ring-4 ring-white dark:ring-[#1a1f2e] shadow-md">
                    {localAvatarUrl ? (
                      <Image src={cloudinaryUrl(localAvatarUrl, 160)} fill alt="Avatar" className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary dark:text-[#93b8f0] text-2xl font-bold">
                        {(localName || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name + role */}
                  <div className="text-center">
                    <p className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50 leading-tight">
                      {localName || "—"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile?.email}</p>
                  </div>

                  {/* Role badge */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    isMaster
                      ? "bg-[#FFC700]/20 text-[#92400E] dark:bg-[#FFC700]/10 dark:text-[#FFC700]"
                      : "bg-secondary text-primary dark:bg-[#1e3a5f] dark:text-[#93b8f0]"
                  }`}>
                    {isMaster ? <Crown size={11} /> : <Feather size={11} />}
                    {isMaster ? "Master" : "Writer"}
                  </span>
                </div>

                {/* Bio + actions */}
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Bio</p>
                    <p className="text-sm text-[#374151] dark:text-gray-300 leading-relaxed">
                      {localBio || <span className="text-gray-400 dark:text-gray-600 italic">No bio yet.</span>}
                    </p>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />

                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="w-full py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    Change password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}

      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}
    </>
  );
}
