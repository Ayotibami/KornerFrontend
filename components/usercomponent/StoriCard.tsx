import { inter, nunito } from "@/lib/font";
import Image from "next/image";
import React from "react";

export default function StoriCard({
  image,
  authorAvatar,
  authorName,
  title,
  excerpt,
  date,
}: {
  image: string;
  authorAvatar: string;
  authorName: string;
  title: string;
  excerpt: string;
  date: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 500,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          height: "55%",
          backgroundColor: "lightgray",
          position: "relative",
        }}
      >
        {image && (
          <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
        )}
      </div>
      <div
        style={{
          padding: 14,
          height: "45%",
          justifyContent: "space-evenly",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontWeight: 800,
            fontSize: "1rem",
            color: "black",
            textAlign: "left",
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "#767575",
            fontFamily: inter.style.fontFamily,
            fontSize: "0.8rem",
            fontWeight: 500,
            textAlign: "left",
          }}
        >
          {excerpt}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "lightgray",
                flexShrink: 0,
              }}
            >
              {authorAvatar && (
                <Image
                  src={authorAvatar}
                  alt="avatar"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <p
              style={{
                fontFamily: inter.style.fontFamily,
                fontSize: "0.7rem",
                color: "#767575",
                fontWeight: 600,
                fontStyle: "italic",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {authorName}
            </p>
          </div>
          <p
            style={{
              color: "#767575",
              fontFamily: inter.style.fontFamily,
              fontSize: "0.7rem",
              fontWeight: 500,
            }}
          >
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
