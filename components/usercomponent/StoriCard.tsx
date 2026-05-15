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
        height: 300,
        overflow: "hidden",

        display: "flex",
        flexDirection: "column",

        backgroundColor: "white",
      }}
    >
      <div
        style={{
          height: "45%",
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
          padding: 10,
          height: "55%",
          justifyContent: "space-around",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontWeight: 800,
            fontSize: "0.8rem",
            color: "black",
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "#767575",
            fontFamily: inter.style.fontFamily,
            fontSize: "0.6rem",
            fontWeight: 500,
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
                width: 20,
                height: 20,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "lightgray",
                flexShrink: 0,
              }}
            >
              <Image
                src={authorAvatar || "/placeholder.png"}
                alt="avatar"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <p
              style={{
                fontFamily: inter.style.fontFamily,
                fontSize: "0.5rem",
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
              fontSize: "0.5rem",
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
