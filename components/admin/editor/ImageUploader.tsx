"use client";

// Inline 16:9 image block for the story body.
// Deferred-upload design: shows a blob preview immediately, calls onFilePicked(file)
// so the parent can store the file and upload it on Save.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ImageUploader({ mode, url, onFilePicked }: {
  mode: "write" | "read";
  url: string;
  onFilePicked: (file: File) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(url);
  const ref = useRef<HTMLInputElement>(null);

  // Sync when parent resets or prefills the URL (e.g. after save or form reset).
  useEffect(() => {
    setPreviewUrl(url);
  }, [url]);

  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    onFilePicked(file);
  };

  return (
    <>
      <div
        className="relative w-full aspect-video bg-slate-200 dark:bg-[#2d3748] flex items-center justify-center overflow-hidden"
        style={{ borderRadius: "clamp(8px, 2vw, 16px)" }}
      >
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Story image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        )}
        {mode === "write" && (
          <button
            onClick={() => ref.current?.click()}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1f2e]/90 text-[#0f1e3d] dark:text-gray-100 rounded-xl px-6 py-2.5 font-bold text-sm shadow-md whitespace-nowrap z-10 cursor-pointer"
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
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </>
  );
}
