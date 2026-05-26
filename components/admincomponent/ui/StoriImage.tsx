"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "wh6vvgfv");
  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dbyxdhnjb/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url ?? null;
  } catch {
    return null;
  }
};

export default function StoriImage({
  updateImage,
  mode,
  content = null,
  existingUrl,
}: {
  updateImage: (...args: any[]) => void;
  mode?: string;
  content?: { position: number } | null;
  existingUrl?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const isCover = content === null;
  const isWrite = mode === "write";

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    const url = await uploadToCloudinary(file);
    setUploading(false);
    if (!url) return;
    if (content) {
      updateImage(content.position, url);
    } else {
      updateImage(url);
    }
  };

  const UploadButton = ({ bottom = 20 }: { bottom?: number }) => (
    <button
      onClick={() => ref.current?.click()}
      disabled={uploading}
      style={{
        position: "absolute",
        bottom,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255,255,255,0.92)",
        border: "none",
        borderRadius: 30,
        padding: "10px 24px",
        fontWeight: 700,
        fontSize: 13,
        cursor: uploading ? "not-allowed" : "pointer",
        opacity: uploading ? 0.7 : 1,
        whiteSpace: "nowrap",
        zIndex: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      {uploading ? "Uploading…" : previewUrl ? "Change Image" : "Upload Image"}
    </button>
  );

  return (
    <>
      {isCover ? (
        // ── COVER IMAGE ─────────────────────────────────────────────────────────
        // Matches the StoriCover shape on the user side — full-width rounded card,
        // image fills it as a CSS background so the overlay button sits on top cleanly.
        <div
          style={{
            width: "100%",
            height: "clamp(320px, 55vw, 480px)",
            borderRadius: "clamp(16px, 4vw, 36px)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: previewUrl ? "black" : "#1a2744",
            backgroundImage: previewUrl ? `url("${previewUrl}")` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!previewUrl && (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, margin: 0 }}>
              No cover image
            </p>
          )}
          {isWrite && <UploadButton bottom={24} />}
        </div>
      ) : (
        // ── IMAGE BLOCK ─────────────────────────────────────────────────────────
        // Matches the user-side ImageBlock — 16:9, rounded corners, image covers it.
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            position: "relative",
            borderRadius: "clamp(8px, 2vw, 16px)",
            overflow: "hidden",
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Story image"
              fill
              style={{ objectFit: "cover" }}
            />
          )}
          {isWrite && <UploadButton bottom={12} />}
        </div>
      )}

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
