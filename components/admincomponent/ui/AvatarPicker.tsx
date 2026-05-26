"use client";

import { primaryColor } from "@/app/constants/color";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function AvatarPicker({ setAvatarUrl }: { setAvatarUrl: (file: File) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
          <Image src={previewUrl} fill alt="avatar" style={{ objectFit: "cover" }} />
        ) : (
          <User size={32} color={primaryColor} />
        )}
      </div>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setAvatarUrl(file);
          setPreviewUrl(URL.createObjectURL(file));
        }}
      />

      <Plus
        onClick={() => fileRef.current?.click()}
        color="white"
        size={22}
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: 0,
          right: -4,
          borderRadius: "50%",
          backgroundColor: primaryColor,
          padding: 4,
          cursor: "pointer",
        }}
      />
    </div>
  );
}
