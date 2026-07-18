"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ImageUploader({ mode, url, onFilePicked }: {
  mode: "write" | "read";
  url: string;
  onFilePicked: (file: File) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(url);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(url);
    setLoaded(false); // reset skeleton when URL changes
  }, [url]);

  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setLoaded(false);
    onFilePicked(file);
  };

  // Read mode: natural dimensions — image renders at its own width/height,
  // centered, never upscaled beyond its natural size.
  // minHeight holds the skeleton open until onLoad fires, then collapses to
  // zero so no grey gap shows below small images.
  if (mode === "read") {
    return (
      <div
        className="w-full overflow-hidden bg-slate-200 dark:bg-[#2d3748]"
        style={{ borderRadius: "clamp(8px, 2vw, 16px)", minHeight: loaded ? 0 : (previewUrl ? 200 : 0) }}
      >
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Story image"
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              display: "block",
              margin: "0 auto",
            }}
            unoptimized={previewUrl.startsWith("blob:")}
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    );
  }

  // Write mode: fixed 16:9 container gives a consistent target for the upload button
  // and shows a crop-preview of how the image fills that space.
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
            sizes="(max-width: 768px) 100vw, 800px"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        )}
        <button
          onClick={() => ref.current?.click()}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1a1f2e]/90 text-[#0f1e3d] dark:text-gray-100 rounded-xl px-6 py-2.5 font-bold text-sm shadow-md whitespace-nowrap z-10 cursor-pointer"
        >
          {previewUrl ? "Change Image" : "Upload Image"}
        </button>
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
