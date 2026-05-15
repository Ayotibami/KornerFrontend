"use client";

import { primaryColor } from "@/app/constants/color";
import { Camera, Plus } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

export default function AvatarPicker({}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          height: 70,
          width: 70,
          borderRadius: 35,
          borderColor: "#165ABF",
          borderWidth: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {previewUrl && (
          <Image
            src={previewUrl ?? null}
            fill
            alt="avatar"
            objectFit="cover"
          ></Image>
        )}
      </div>
      <input
        type="file"
        hidden={true}
        ref={fileRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          // setAvatarUrl(file);

          const imageUrl = URL.createObjectURL(file);
          setPreviewUrl(imageUrl);
        }}
      />

      <Plus
        onClick={() => fileRef.current?.click()}
        color={"white"}
        size={25}
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: -5,
          right: -10,
          borderRadius: 50,

          backgroundColor: primaryColor,
          padding: 5,
        }}
      ></Plus>
    </div>
  );
}
