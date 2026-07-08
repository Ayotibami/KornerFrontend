"use client";

// Cover image component shown at the top of the story editor.
// In write mode: shows an "Upload Image" / "Change Image" button overlaid on the image.
// In read mode: shows the image only (no upload button).
//
// Deferred-upload design: no Cloudinary call happens here. The component shows
// a local blob preview immediately for fast feedback, then calls onFilePicked(file)
// so the parent can hold the File and upload it on Save. This means no orphaned
// Cloudinary images are created during drafting.

import { useEffect, useRef, useState } from "react";

export default function CoverImage({
  mode,
  url,
  onFilePicked,
}: {
  mode: "write" | "read";
  url: string | null;
  onFilePicked: (file: File) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(url);
  const ref = useRef<HTMLInputElement>(null);

  // Sync previewUrl when the url prop changes.
  // On the edit page, CoverImage mounts before the context is seeded (url starts as null).
  // When EditStoryEditor's useEffect seeds coverImage, this effect picks up the real URL.
  // After Save, coverImage in context is updated to the new Cloudinary URL — this picks it up.
  useEffect(() => {
    setPreviewUrl(url);
  }, [url]);

  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file)); // immediate local preview
    onFilePicked(file);                        // parent stores the file for upload on Save
  };

  return (
    <>
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

        {mode === "write" && (
          <button
            onClick={() => ref.current?.click()}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1f2e]/90 text-[#0f1e3d] dark:text-gray-100 rounded-xl px-6 py-2.5 font-bold text-sm shadow-md whitespace-nowrap z-10 cursor-pointer"
          >
            {previewUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </div>

      <input
        type="file"
        hidden
        ref={ref}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          // Reset so picking the same file again still fires onChange
          e.target.value = "";
        }}
      />
    </>
  );
}
