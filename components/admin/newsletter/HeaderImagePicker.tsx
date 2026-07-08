"use client";

// Newsletter cover image picker — deferred upload.
// Picking a file shows a blob preview immediately; the actual Cloudinary upload
// happens only when the parent calls its send/save handler.
// The parent tracks `pendingImageFile` state; this component just signals picks/removes.

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function HeaderImagePicker({
  url,
  onFilePicked,
  onRemove,
  disabled = false,
}: {
  url: string | null;
  onFilePicked: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(url);
  const ref = useRef<HTMLInputElement>(null);

  // Sync when the parent resets/prefills externally (form reset after send,
  // edit modal prefill on open, Resend loading a template).
  useEffect(() => {
    setPreviewUrl(url);
  }, [url]);

  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    onFilePicked(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onRemove();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-primary dark:text-[#93b8f0]">
        Cover image <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
      </label>

      {previewUrl ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-secondary dark:border-[#2a4a7a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={disabled}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <ImagePlus size={12} />
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FEE2E2] dark:bg-[#450a0a] text-[#DC2626] dark:text-[#FCA5A5] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={disabled}
          className="w-full h-44 rounded-2xl border-2 border-dashed border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] flex flex-col items-center justify-center gap-1.5 text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImagePlus size={18} />
          <span className="text-xs font-bold">Upload cover image</span>
        </button>
      )}

      <input
        type="file"
        hidden
        ref={ref}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
