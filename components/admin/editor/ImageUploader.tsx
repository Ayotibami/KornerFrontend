"use client";

// Inline 16:9 image block for the story body.
// Upload flow: blob preview → Cloudinary → final URL (see lib/cloudinary.ts for full pattern).

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

export default function ImageUploader({ mode, url, onChange, onUploadStart, onUploadEnd }: {
  mode: "write" | "read"; url: string; onChange: (url: string) => void;
  onUploadStart: () => void; onUploadEnd: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(url);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    onUploadStart();
    try {
      const cloudUrl = await uploadToCloudinary(file);
      onChange(cloudUrl);
    } catch {
      setPreviewUrl(url);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadEnd();
    }
  };

  return (
    <>
      <div
        className="relative w-full aspect-video bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center overflow-hidden"
        style={{ borderRadius: "clamp(8px, 2vw, 16px)" }}
      >
        {previewUrl && (
          <Image src={previewUrl} alt="Story image" fill className="object-cover" unoptimized />
        )}
        {mode === "write" && (
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1f2e]/90 text-[#0f1e3d] dark:text-gray-100 rounded-full px-6 py-2.5 font-bold text-sm shadow-md whitespace-nowrap z-10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : previewUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </div>
      <input type="file" hidden ref={ref} accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </>
  );
}
