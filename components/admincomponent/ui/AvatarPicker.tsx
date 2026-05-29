"use client";

import { primaryColor } from "@/app/constants/color";
import { Loader2, Plus, User } from "lucide-react";
import { toast } from "sonner";
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

export default function AvatarPicker({
  setAvatarUrl,
  onUploadingChange,
}: {
  setAvatarUrl: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    onUploadingChange?.(true);
    const url = await uploadToCloudinary(file);
    setUploading(false);
    onUploadingChange?.(false);
    if (!url) {
      setPreviewUrl(null);
      toast.error("Image upload failed. Please try again.");
      return;
    }
    setAvatarUrl(url);
  };

  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      <div
        style={{
          height: 80,
          width: 80,
          borderRadius: "50%",
          border: `2px solid ${primaryColor}`,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#F0F5FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <User size={32} color={primaryColor} />
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader2 size={22} color={primaryColor} className="animate-spin" />
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

      <Plus
        onClick={() => !uploading && fileRef.current?.click()}
        color="white"
        size={22}
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: 0,
          right: -4,
          borderRadius: "50%",
          backgroundColor: uploading ? "#9CA3AF" : primaryColor,
          padding: 4,
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      />
    </div>
  );
}
