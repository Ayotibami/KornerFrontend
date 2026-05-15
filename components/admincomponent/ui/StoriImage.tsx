"use client";

import Image from "next/image";
import React, { useRef } from "react";

export default function StoriImage({
  updateImage,
  mode,
  content = null,
}: {
  setcoverImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const ref = useRef<HTMLImageElement>(null);
  console.log(previewImage);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "wh6vvgfv");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbyxdhnjb/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: 400,

          backgroundColor: previewImage ? "transparent" : "#E8EEF8",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {previewImage && (
          <Image
            src={previewImage}
            alt="Preview"
            fill
            style={{
              backgroundColor: "transparent",
            }}
            objectFit="contain"
          />
        )}
        {mode == "write" && (
          <p
            style={{
              position: "absolute",
              top: 150,
              left: "50%",
              transform: "translateX(-50%)",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "#FFFFFFAA",
              padding: 10,
              borderRadius: 10,
              fontSize: 12,

              cursor: "pointer",
            }}
            onClick={() => {
              ref.current?.click();
            }}
          >
            {previewImage ? "Change Image" : "Upload image"}
          </p>
        )}
      </div>
      <input
        type="file"
        hidden
        ref={ref}
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          const localUrl = URL.createObjectURL(file);
          setPreviewImage(localUrl);
          const url = await uploadImage(file);
          if (content) {
            updateImage(content.position, url);
            return;
          }
          updateImage(url);
        }}
      />
    </>
  );
}
