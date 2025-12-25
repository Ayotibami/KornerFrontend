'use client";';

import Image from "next/image";
import React, { useRef } from "react";

export default function Avatar({ setAvatarUrl }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  return (
    <div>
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: 50,
          borderColor: "#165ABF",
          borderWidth: 2,
          overflow: "hidden",
        }}
      >
        {previewUrl && (
          <Image
            src={previewUrl ?? null}
            width={100}
            height={100}
            alt="avatar"
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
          setAvatarUrl(file);

          const imageUrl = URL.createObjectURL(file);
          setPreviewUrl(imageUrl);
        }}

        // placeholder={placeholder}
      />
      <button onClick={() => fileRef.current?.click()} type="button">
        <p
          style={{
            color: "#165ABF",
          }}
        >
          {" "}
          Upload Avatar
        </p>
      </button>
    </div>
  );
}
