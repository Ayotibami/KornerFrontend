"use client";

import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import AvatarPicker from "./AvatarPicker";
import { updateProfile } from "@/app/admin/home/action";
import type { AdminProfile } from "@/types/admin";

const inputClass =
  "w-full bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a] rounded-xl px-4 py-2.5 outline-none font-nunito font-medium text-[#374151] dark:text-gray-300 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600";

export default function ProfileModal({
  profile,
  onClose,
}: {
  profile: AdminProfile | null;
  onClose: () => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [localName, setLocalName] = useState(profile?.admin_name ?? "");
  const [localBio, setLocalBio] = useState(profile?.bio ?? "");
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(
    profile?.avatar_url ?? "",
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!localName.trim()) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    const result = await updateProfile(localName, localBio, localAvatarUrl);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Profile updated.");
    setIsEdit(false);
    router.refresh();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1f2e] rounded-2xl w-[90vw] max-w-[420px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] font-nunito"
        onClick={(e) => e.stopPropagation()}
      >
        {isEdit ? (
          <>
            {/* ── Edit mode header ── */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                title="Close"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar picker — pre-filled with existing avatar */}
            <div className="flex justify-center mb-6">
              <AvatarPicker
                initialUrl={localAvatarUrl ?? undefined}
                setAvatarUrl={(url) => setLocalAvatarUrl(url)}
                onUploadingChange={setAvatarUploading}
              />
            </div>

            {/* Email — read-only */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
                Email
              </label>
              <p
                className={`${inputClass} opacity-60 cursor-default select-all`}
              >
                {profile?.email ?? "—"}
              </p>
            </div>

            {/* Name input */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
                Name
              </label>
              <input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            {/* Bio textarea */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="font-semibold text-sm text-[#374151] dark:text-gray-300">
                Bio
              </label>
              <textarea
                value={localBio ?? ""}
                onChange={(e) => setLocalBio(e.target.value)}
                placeholder="Write a short bio…"
                rows={3}
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>

            <button
              disabled={avatarUploading || saving}
              onClick={handleSave}
              className="w-full py-2.5 rounded-full bg-primary text-white font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-transform hover:scale-[0.98] active:scale-95"
            >
              {avatarUploading
                ? "Uploading…"
                : saving
                  ? "Saving…"
                  : "Save changes"}
            </button>
          </>
        ) : (
          <>
            {/* ── View mode header ── */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-[#0f1e3d] dark:text-gray-50">
                Profile
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEdit(true)}
                  title="Edit profile"
                  className="text-primary dark:text-[#93b8f0] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={onClose}
                  title="Close"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Avatar + name + email */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative w-24 h-24 rounded-full border-2 border-primary bg-secondary overflow-hidden flex-shrink-0">
                {localAvatarUrl && (
                  <Image
                    src={localAvatarUrl}
                    fill
                    alt="Profile picture"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-[#0f1e3d] dark:text-gray-50">
                  {localName || "—"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-sm text-[#374151] dark:text-gray-300">
                Bio
              </p>
              <div className="bg-[#F0F5FF] dark:bg-[#1e2a3a] rounded-xl px-4 py-3">
                <p className="text-sm text-[#374151] dark:text-gray-300 leading-relaxed">
                  {localBio || "No bio yet."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
