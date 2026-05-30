"use client";

// Cover image component shown at the top of the story editor.
// In write mode: shows an "Upload Image" / "Change Image" button overlaid on the image.
// In read mode: shows the image only (no upload button).
//
// Upload flow — same pattern as ImageUploader and AvatarPicker:
//   1. Show an immediate local blob preview (fast feedback, avoids white flash).
//   2. Upload to Cloudinary in the background.
//   3. On success: call onChange() with the permanent Cloudinary URL so the parent
//      context stores the real URL (not a temporary blob).
//   4. On failure: revert preview to the original url prop and show a toast.
//   5. `finally`: always call onUploadEnd() regardless of success/failure,
//      so the editor's uploadingCount counter resets and the save button re-enables.
//
// `onUploadStart` / `onUploadEnd` increment/decrement the editor's uploadingCount
// to keep the save button disabled while uploads are in progress.

import { useEffect, useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

export default function CoverImage({
  mode,
  url,
  onChange,
  onUploadStart,
  onUploadEnd,
}: {
  mode: "write" | "read";
  url: string | null;
  onChange: (url: string) => void;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // Sync previewUrl when the url prop changes.
  // On the edit page, CoverImage mounts before the context is seeded (url starts as null).
  // When EditStoryEditor's useEffect seeds coverImage, this effect picks up the real URL.
  useEffect(() => {
    setPreviewUrl(url);
  }, [url]);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file)); // optimistic preview
    setUploading(true);
    onUploadStart();
    try {
      const cloudUrl = await uploadToCloudinary(file);
      onChange(cloudUrl);
    } catch {
      setPreviewUrl(url); // revert to original on error
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadEnd();
    }
  };

  return (
    <>
      {/* Full-width rounded image container.
          Height uses clamp so it's proportional on all screen sizes.
          Uses CSS background-image rather than <img> to get background-size: cover
          without a fixed aspect ratio constraint. */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          height: "clamp(320px, 55vw, 480px)",
          borderRadius: "clamp(16px, 4vw, 36px)",
          backgroundColor: previewUrl ? "black" : "#1a2744",
          backgroundImage: previewUrl ? `url("${previewUrl}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!previewUrl && (
          <p className="text-white/35 text-sm">No cover image</p>
        )}

        {/* Upload button — only shown in write mode, centred at the bottom */}
        {mode === "write" && (
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1f2e]/90 text-[#0f1e3d] dark:text-gray-100 rounded-full px-6 py-2.5 font-bold text-sm shadow-md whitespace-nowrap z-10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : previewUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </div>

      {/* Hidden file input — triggered programmatically by the button above */}
      <input
        type="file"
        hidden
        ref={ref}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </>
  );
}
