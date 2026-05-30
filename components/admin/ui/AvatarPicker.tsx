"use client";

// Avatar picker used on the signup page.
// Shows a circle with a + button in the bottom-right corner.
// Clicking the + opens a file picker, then uploads to Cloudinary.
//
// Upload flow:
//   1. Set a local blob preview immediately so the user sees their image right away.
//   2. Upload to Cloudinary in the background.
//   3. On success: call setAvatarUrl with the permanent Cloudinary URL.
//   4. On failure: revert the preview to null and show a toast.
//   5. `finally`: always reset the uploading state so the + button re-enables.
//      The `finally` block runs even when an error is thrown — critical for cleanup.
//
// `onUploadingChange` notifies the parent (SignupPage) so it can disable the
// submit button while the avatar is uploading.

import { PRIMARY } from "@/constants/theme";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Loader2, Plus, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AvatarPicker({
  setAvatarUrl,
  onUploadingChange,
  initialUrl,
}: {
  setAvatarUrl: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  initialUrl?: string;  // pre-populate with an existing avatar (e.g. profile modal edit mode)
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file)); // immediate optimistic preview
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const url = await uploadToCloudinary(file);
      setAvatarUrl(url);
    } catch {
      setPreviewUrl(initialUrl ?? null); // revert to original on failure
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  return (
    <div className="relative w-20 h-20">
      {/* Avatar circle — shows preview image or a placeholder user icon */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-[#F0F5FF]">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
        ) : (
          <User size={32} color={PRIMARY} />
        )}

        {/* Uploading overlay — semi-transparent white with a spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <Loader2 size={22} color={PRIMARY} className="animate-spin" />
          </div>
        )}
      </div>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {/* + button in the bottom-right corner of the circle */}
      <button
        type="button"
        onClick={() => !uploading && fileRef.current?.click()}
        disabled={uploading}
        aria-label="Upload profile picture"
        className="absolute bottom-0 -right-1 z-10 rounded-full p-1 transition-colors disabled:cursor-not-allowed"
        style={{ backgroundColor: uploading ? "#9CA3AF" : PRIMARY }}
      >
        <Plus size={14} color="white" />
      </button>
    </div>
  );
}
