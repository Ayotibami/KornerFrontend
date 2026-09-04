"use client";

// Cover image component shown at the top of the story editor.
// In write mode: shows "Image" / "GIF/Stickers" buttons overlaid on the image —
// same labels whether one's already attached or not, since there's no way to
// tell from the stored URL alone whether it came from an upload or a pick.
// In read mode: shows the image only (no upload button).
//
// Deferred-upload design: no Cloudinary call happens here. The component shows
// a local blob preview immediately for fast feedback, then calls onFilePicked(file)
// so the parent can hold the File and upload it on Save. This means no orphaned
// Cloudinary images are created during drafting.

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Sticker } from "lucide-react";
import GifStickerPicker from "@/components/admin/media/GifStickerPicker";

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
  const [pickerOpen, setPickerOpen] = useState(false);
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
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            <button
              onClick={() => ref.current?.click()}
              className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-[#0f1e3d] shadow-md dark:bg-[#1a1f2e]/90 dark:text-gray-100"
            >
              <ImagePlus size={16} /> Image
            </button>
            <button
              onClick={() => setPickerOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/90 px-5 py-2.5 text-sm font-bold text-[#0f1e3d] shadow-md dark:bg-[#1a1f2e]/90 dark:text-gray-100"
            >
              <Sticker size={16} /> GIF/Stickers
            </button>
          </div>
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

      {mode === "write" && (
        <GifStickerPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={handleFile} />
      )}
    </>
  );
}
