"use client";

import { PRIMARY } from "@/constants/theme";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Loader2, Plus, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AvatarPicker({
  onUploadComplete,
  onUploadingChange,
  initialUrl,
}: {
  onUploadComplete: (result: { url: string; publicId: string }) => void;
  onUploadingChange?: (uploading: boolean) => void;
  initialUrl?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const result = await uploadToCloudinary(file);
      onUploadComplete({ url: result.url, publicId: result.publicId });
    } catch {
      setPreviewUrl(initialUrl ?? null);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  return (
    // The whole label is clickable — tapping anywhere on the circle opens the picker
    <label
      htmlFor="avatar-file-input"
      aria-label="Upload profile picture"
      onClick={(e) => { if (uploading) e.preventDefault(); }}
      className="relative w-20 h-20 block"
      style={{ cursor: uploading ? "not-allowed" : "pointer" }}
    >
      {/* Hidden file input — CSS hidden, NOT the `hidden` attribute (blocks on iOS) */}
      <input
        id="avatar-file-input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        style={{ position: "absolute", opacity: 0, width: 1, height: 1, overflow: "hidden" }}
      />

      {/* Avatar circle */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-[#F0F5FF]">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
        ) : (
          <User size={32} color={PRIMARY} />
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <Loader2 size={22} color={PRIMARY} className="animate-spin" />
          </div>
        )}
      </div>

      {/* + badge — decorative div inside the label, not a separate button */}
      <div
        className="absolute bottom-0 -right-1 z-10 rounded-full p-1 pointer-events-none"
        style={{ backgroundColor: uploading ? "#9CA3AF" : PRIMARY }}
      >
        <Plus size={14} color="white" />
      </div>
    </label>
  );
}
